import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchWriteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import type { valueOf } from "../valueOf.js";
import type { Entity, Entities } from "./entity.js";
import {
  isKey,
  type KeysOfEntities,
  type KeyOfEntity,
  PK,
  ShortKeyOfEntity,
} from "./key.js";
import type { LastEvaluatedKey, QueriedItem } from "./query.js";
import {
  QueryExpression,
  isFilterExpression,
  isBetween,
  isBeginsWith,
  SortKeyExpression,
} from "./condition.js";
import { Widen, Simplify, NotUndefined } from "../util.js";

export interface TableProps {
  tableName: string;
  client: DynamoDBDocumentClient;
}

export function table<E extends Record<string, Entity>>(
  entities: E
): TableSpec<E> {
  // @ts-expect-error - cannot implement dynamic methods
  return class implements Table<E> {
    readonly tableName;
    readonly client;

    constructor(props: TableProps) {
      this.tableName = props.tableName;
      this.client = props.client;

      const self = this;
      // @ts-expect-error
      this.query.iter = async function* (query: any, options: any) {
        let lastEvaluatedKey;
        do {
          const response = await self.query(query, options);
          lastEvaluatedKey = response.lastEvaluatedKey;
          for (const item of response.items) {
            yield item;
          }
        } while (lastEvaluatedKey);
      };
    }

    async get(key: unknown, ...rest: unknown[]): Promise<any> {
      if (Array.isArray(key) || rest.length > 0) {
        const keys = Array.isArray(key) ? key : [key, ...rest];

        const keyReverseLookup = new Map<string, unknown>();

        const batchGetParams: BatchGetCommandInput = {
          RequestItems: {
            [this.tableName]: {
              Keys: keys.map((key, i) => {
                const rawKey = createKey(key);
                keyReverseLookup.set(serializeKey(rawKey), key);
                return rawKey;
              }),
            },
          },
        };

        const response = await this.client.send(
          new BatchGetCommand(batchGetParams)
        );

        const unprocessedKeys = response.UnprocessedKeys?.[
          this.tableName
        ]?.Keys?.map((key: any) => keyReverseLookup.get(serializeKey(key)));

        const itemsMap = new Map(
          response.Responses?.[this.tableName].map((item: any) => {
            return [serializeKey(item), parseItem(item)];
          }) ?? []
        );

        const items = keys.map((key) =>
          itemsMap.get(serializeKey(createKey(key)))
        );

        return {
          items,
          unprocessedKeys,
        };
      } else if (rest.length === 0) {
        if (!isKey(key)) {
          throw new Error(`Invalid Key: ${JSON.stringify(key)}`);
        }
        const entity = findEntity(key.$type);
        if (entity === undefined) {
          throw new Error(`Unknown Entity: ${key.$type}`);
        }

        const response = await this.client.send(
          new GetCommand({
            TableName: this.tableName,
            Key: createKey(key),
          })
        );

        return {
          item: parseItem(response.Item),
        };
      } else {
        throw new Error(
          `Invalid arguments: ${JSON.stringify([key, ...rest], null, 2)}`
        );
      }
    }

    async put(item: any, ...rest: any[]): Promise<any> {
      if (Array.isArray(item) || rest.length > 0) {
        const items = Array.isArray(item) ? item : [item, ...rest];
        const failed: any[] = [];
        const response = await this.client.send(
          new BatchWriteCommand({
            RequestItems: {
              [this.tableName]: items.map((item) => ({
                PutRequest: {
                  Item: marshallItem(getEntityFor(item), item),
                },
              })),
            },
          })
        );
        return {
          unprocessedItems: response.UnprocessedItems,
        };
      } else if (rest.length === 0) {
        const entity = getEntityFor(item);
        const response = await this.client.send(
          new PutCommand({
            TableName: this.tableName,
            Item: marshallItem(entity, item),
          })
        );
        return {};
      } else {
        throw new Error(`Invalid arguments: ${[item, ...rest]}`);
      }

      function marshallItem(entity: Entity, item: any) {
        return {
          ...(entity.marshall<any>(item) as any),
          ...createKey(item),
        };
      }
    }

    async query<const Q extends QueryExpression<E>>(
      query: Q,
      options?: {
        lastEvaluatedKey?: LastEvaluatedKey<E, Q>;
      }
    ): Promise<{
      items: QueriedItem<E, Q>[];
      lastEvaluatedKey: LastEvaluatedKey<E, Q> | undefined;
    }> {
      let keyConditionExpression = Object.values(entities)
        .map(createKeyConditionExpression)
        .find((v) => v !== undefined);
      if (keyConditionExpression === undefined) {
        throw new Error(`Invalid Query: ${JSON.stringify(query)}`);
      }

      const params = {
        TableName: this.tableName,
        ...keyConditionExpression,
        ConsistentRead: true,
      } satisfies QueryCommandInput;
      const response = await this.client.send(new QueryCommand(params));

      return {
        items:
          response.Items?.map(parseItem).filter(
            (v): v is NotUndefined<typeof v> => v !== undefined
          ) ?? [],
        lastEvaluatedKey: response.LastEvaluatedKey as any,
      };

      function createKeyConditionExpression(entity: Entity):
        | {
            KeyConditionExpression: string;
            ExpressionAttributeNames: Record<string, string>;
            ExpressionAttributeValues: Record<string, any>;
          }
        | undefined {
        const queryKeys = new Set(Object.keys(query));

        const pkValue: string[] = [];
        for (const pk of entity.traits.pk) {
          if (pk in query) {
            const pkV = query[pk as keyof typeof query];
            if (typeof pkV !== "string") {
              return undefined;
            }
            queryKeys.delete(pk);
            pkValue.push(pkV);
          }
        }
        const $pk = pkValue.join("#");
        let $sk: string | undefined;
        const skValuePrefix: string[] = [];
        const skExpressionAttributeValues: Record<string, string> = {};

        for (const sk of entity.traits.sk ?? []) {
          if (sk in query) {
            queryKeys.delete(sk);
            const skV = query[sk as keyof typeof query];
            if (isFilterExpression(skV)) {
              if (isBetween(skV)) {
                skExpressionAttributeValues[":sk_left"] = [
                  ...skValuePrefix,
                  skV.$between[0],
                ].join("#");
                skExpressionAttributeValues[":sk_right"] = [
                  ...skValuePrefix,
                  skV.$between[1],
                ].join("#");
                $sk = `between :sk_left and :sk_right`;
              } else if (isBeginsWith(skV)) {
                skExpressionAttributeValues[":sk_prefix"] = [
                  ...skValuePrefix,
                  skV.$beginsWith,
                ].join("#");
                $sk = `begins_with(#sk, :sk_prefix)`;
              }
              break;
            } else if (typeof skV !== "string") {
              return undefined;
            }
            skValuePrefix.push(skV);
          }
        }
        if (!$sk) {
          $sk = skValuePrefix.join("#");
        }
        if (queryKeys.size > 0) {
          return undefined;
        }

        return {
          KeyConditionExpression: `#pk = :pk${$sk ? ` and ${$sk}` : ""}`,
          ExpressionAttributeNames: {
            "#pk": "$pk",
            ...($sk
              ? {
                  "#sk": "$sk",
                }
              : {}),
          },
          ExpressionAttributeValues: {
            ":pk": $pk,
            ...skExpressionAttributeValues,
          },
        };
      }
    }
  };

  function parseItem(item: any) {
    const entity = findEntity(item.$type);
    if (entity === undefined) {
      throw new Error(`Unknown Entity: ${item.$type}`);
    }
    return entity.parse(item) as any;
  }

  function getEntityFor(item: any) {
    if (!isKey(item)) {
      throw new Error(`Invalid Key: ${JSON.stringify(item)}`);
    }
    const entity = findEntity(item.$type);
    if (entity === undefined) {
      throw new Error(`Unknown Entity: ${item.$type}`);
    }
    return entity;
  }

  function findEntity(fqn: string): E[keyof E] | undefined {
    return Object.values(entities).find((e) => e.traits.fqn === fqn) as any;
  }

  function serializeKey({ $pk, $sk }: { $pk: string; $sk: string }) {
    return `${$pk}|${$sk}`;
  }

  function createKey(key: any) {
    if (!isKey(key)) {
      throw new Error(`Invalid Key: ${JSON.stringify(key)}`);
    }
    const entity = findEntity(key.$type);
    if (entity === undefined) {
      throw new Error(`Unknown Entity: ${key.$type}`);
    }
    const $pk = entity.traits.pk.map((pk) => key[pk]).join("#");
    const $sk = entity.traits.sk?.map((sk) => key[sk])?.join("#");
    return { $pk, $sk };
  }
}

export interface TableSpec<E extends Record<string, Entity>> {
  entities: E;

  LastEvaluatedKey<Q extends QueryExpression<E>>(): LastEvaluatedKey<E, Q>;
  Query: QueryExpression<E>;
  QueryItem<Q extends QueryExpression<E>>(): QueriedItem<E, Q>;

  new (props: TableProps): Table<E>;
}

export type Table<E extends Entities> = {
  [entityName in keyof E]: E[entityName]["traits"]["sk"] extends undefined
    ? GetEntity<E[entityName]>
    : GetEntity<E[entityName]> & QueryEntity<E[entityName]>;
} & {
  get<const Key extends KeysOfEntities<E>>(
    key: Key
  ): Promise<{
    item: GotItem<E, Key> | undefined;
    consumedCapacity?: number;
  }>;
  get<Keys extends BatchGetKeys<E>>(
    keys: Keys
  ): Promise<{
    items: GotItems<E, Keys>;
    unprocessedKeys?: KeysOfEntities<E>[];
    consumedCapacity?: number;
  }>;
  get<const Keys extends BatchGetKeys<E>>(
    ...keys: Keys
  ): Promise<{
    items: GotItems<E, Keys>;
    unprocessedKeys?: KeysOfEntities<E>[];
    consumedCapacity?: number;
  }>;
  put<Items extends valueOf<E[keyof E]>>(
    item: Items
  ): Promise<{
    unprocessedKeys: KeyOfEntity<E[keyof E]>[];
  }>;
  put<const Items extends BatchPutItems<E>>(
    ...items: Items
  ): Promise<{
    unprocessedKeys: valueOf<E[keyof E]>[];
  }>;
  put<const Items extends BatchPutItems<E>>(
    items: Items
  ): Promise<{
    unprocessedKeys: valueOf<E[keyof E]>[] | undefined;
  }>;
  query: {
    <const Q extends QueryExpression<E>>(
      query: Q,
      options?: {
        lastEvaluatedKey?: LastEvaluatedKey<E, Q>;
      }
    ): Promise<{
      items: QueriedItem<E, Q>[];
      lastEvaluatedKey: LastEvaluatedKey<E, Q> | undefined;
    }>;

    iter: <const Q extends QueryExpression<E>>(
      query: Q,
      options?: {
        lastEvaluatedKey?: LastEvaluatedKey<E, Q>;
      }
    ) => AsyncIterable<QueriedItem<E, Q>>;
  };
};

type GotItem<E extends Entities, K extends KeysOfEntities<E>> = valueOf<
  E[{
    [k in keyof E]: valueOf<E[k]> extends Widen<K> ? k : never;
  }[keyof E]]
>;

type GotItems<
  E extends Entities,
  Keys extends readonly [
    KeysOfEntities<E>,
    KeysOfEntities<E>,
    ...KeysOfEntities<E>[]
  ]
> = {
  [i in keyof Keys]:
    | {
        [k in keyof E]: valueOf<E[k]> extends Widen<Keys[i]>
          ? valueOf<E[k]> | undefined
          : undefined;
      }[keyof E]
    | undefined;
};

type BatchGetKeys<E extends Entities> = readonly [
  KeysOfEntities<E>,
  KeysOfEntities<E>,
  ...KeysOfEntities<E>[]
];

type BatchPutItems<E extends Entities> = [
  valueOf<E[keyof E]>,
  valueOf<E[keyof E]>,
  ...valueOf<E[keyof E]>[]
];

type GetEntity<E extends Entity> = {
  get<const K extends ShortKeyOfEntity<E>>(
    key: K
  ): Promise<{
    item: valueOf<E> | undefined;
  }>;
  get<
    const Keys extends readonly [
      ShortKeyOfEntity<E>,
      ShortKeyOfEntity<E>,
      ...ShortKeyOfEntity<E>[]
    ]
  >(
    ...keys: Keys
  ): Promise<{
    items: {
      [i in keyof Keys]: Extract<valueOf<E>, Widen<Keys[i]>> | undefined;
    };
  }>;
  get<
    const Keys extends readonly [
      ShortKeyOfEntity<E>,
      ShortKeyOfEntity<E>,
      ...ShortKeyOfEntity<E>[]
    ]
  >(
    keys: Keys
  ): Promise<{
    items: {
      [i in keyof Keys]: Extract<valueOf<E>, Keys[i]> | undefined;
    };
  }>;
};

type QueryEntity<E extends Entity> = {
  // query<const Q extends QueryExpression<E>>(
  //   query: Q,
  //   options?: {
  //     lastEvaluatedKey?: LastEvaluatedKey<E, Q>;
  //   }
  // ): Promise<{
  //   items: QueriedItem<E, Q>[];
  //   lastEvaluatedKey: LastEvaluatedKey<E, Q> | undefined;
  // }>;

  query<K extends Simplify<PK<E> & SortKeyExpression<E>>>(
    key: K,
    options?: {
      lastEvaluatedKey?: KeyOfEntity<E>;
    }
  ): Promise<{
    items: valueOf<E>[];
    lastEvaluatedKey: Simplify<KeyOfEntity<E> | undefined>;
  }>;
};
