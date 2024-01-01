import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchWriteCommand,
  BatchWriteCommandInput,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import type { valueOf } from "../valueOf.js";
import type { Entity, Entities, entity } from "./entity.js";
import { isKey, type KeysOfEntities, type KeyOfEntity } from "./key.js";
import type { QueriedItem, QueryExpression } from "./query.js";
import {
  isComparator,
  isBetween,
  isBeginsWith,
  ConditionExpression,
} from "./condition.js";
import { Widen, NotUndefined, assertDefined } from "../util.js";
import { UpdateRequest } from "./update.js";
import { IndexQueryExpression, Indexes } from "./index.js";

export interface TableProps {
  tableName: string;
  client: DynamoDBDocumentClient;
}

export interface TableOptions<E extends Entities, I extends Indexes<E>> {
  entities: E;
  indexes?: I;
}

export function table<E extends Entities, I extends Indexes<E>>({
  entities,
  indexes,
}: TableOptions<E, I>): TableSpec<E> {
  // @ts-expect-error - cannot implement dynamic methods
  return class implements Table<E> {
    static readonly entities = entities;
    static readonly indexes = indexes!;

    readonly entities = entities;
    readonly tableName;
    readonly client;

    constructor(props: TableProps) {
      this.tableName = props.tableName;
      this.client = props.client;

      const self = this;
      // @ts-expect-error
      this.query.iter = async function* (query: any, options: any) {
        let nextToken;
        do {
          const response = await self.query(query, options);
          nextToken = response.nextToken;
          for (const item of response.items) {
            yield item;
          }
        } while (nextToken);
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
          item: response.Item ? parseItem(response.Item) : undefined,
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

        const batchPutParams: BatchWriteCommandInput = {
          RequestItems: {
            [this.tableName]: items.map((item) => ({
              PutRequest: {
                Item: marshallItem(getEntityFor(item), item),
              },
            })),
          },
        };
        const response = await this.client.send(
          new BatchWriteCommand(batchPutParams)
        );
        return {
          unprocessedItems: response.UnprocessedItems?.[this.tableName]?.map(
            (item) => parseItem(item.PutRequest?.Item)
          ),
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

    async update<const Req extends UpdateRequest<E>>(
      req: Req,
      options?: {
        where?: ConditionExpression<E>;
      }
    ): Promise<{}> {
      const idToName: {
        [id in string]: string;
      } = {};

      const nameToId: {
        [name in string]: string;
      } = {};

      const values: {
        [id in string]: any;
      } = {};

      const SET: string[] = [];
      const REMOVE: string[] = [];

      let nameIDCounter = 0;
      let valueIDCounter = 0;

      visitUpdateExpr(req);

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: createKey(req),
        UpdateExpression: `${SET.length > 0 ? ` SET ${SET.join(", ")}` : ""}${
          REMOVE.length > 0 ? ` REMOVE ${REMOVE.join(", ")}` : ""
        }`,
        ConditionExpression: options?.where
          ? visitConditionExpr(options.where)
          : undefined!,
        ExpressionAttributeNames: idToName,
        ExpressionAttributeValues: values,
      });

      const response = await this.client.send(command);

      return response;

      function val(value: any) {
        const id = `:${valueIDCounter++}`;
        values[id] = value;
        return id;
      }

      function name(name: string) {
        if (name in nameToId) {
          return idToName[nameToId[name]];
        } else {
          const ref = `#${nameIDCounter++}`;
          nameToId[name] = ref;
          idToName[ref] = name;
          return ref;
        }
      }

      function visitUpdateExpr(
        value: any,
        {
          path,
        }: {
          path?: string | undefined;
        } = {}
      ): void {
        if (value === undefined) {
          assertDefined(path);
          REMOVE.push(name(path));
        } else if (
          value === null ||
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          typeof value === "bigint" ||
          Array.isArray(value)
        ) {
          assertDefined(path);
          SET.push(`${name(path)} = ${val(value)}`);
        } else if (typeof value === "object") {
          Object.entries(value).forEach(([key, value]) => {
            if (key === "$append") {
              assertDefined(path);
              SET.push(
                `${name(path)} = list_append(${name(path)}, ${val([value])})`
              );
            } else if (key === "$set") {
              assertDefined(path);
              SET.push(`${name(path)} = ${val(value)}`);
            } else if (key === "$unset") {
              assertDefined(path);
              REMOVE.push(name(path));
            } else {
              visitUpdateExpr(value, {
                path: path ? `${path}.${key}` : key,
              });
            }
          });
        } else {
          throw new Error(`Invalid update: ${JSON.stringify(value)}`);
        }
      }

      function visitConditionExpr(
        value: any,
        {
          path,
          op = "and",
        }: {
          path?: string | undefined;
          op?: "and" | "or" | "not" | undefined;
        } = {}
      ): string {
        if (
          value === null ||
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean" ||
          typeof value === "bigint"
        ) {
          return val(value);
        } else if (Array.isArray(value)) {
          return val(value);
        } else if (typeof value === "object") {
          if ("$and" in value) {
            return visitConditionExpr(value, {
              path,
              op: "and",
            });
          } else if ("$or" in value) {
            return visitConditionExpr(value, {
              path,
              op: "or",
            });
          } else if ("$not" in value) {
            return visitConditionExpr(value, {
              path,
              op: "not",
            });
          } else {
            return Object.entries(value)
              .map(([key, value]) => visitLeafConditionExpr(key, value))
              .join(" and ");
          }
        } else {
          throw new Error(`Invalid condition: ${JSON.stringify(value)}`);
        }

        function visitLeafConditionExpr(key: string, value: any) {
          if (key === "$exists") {
            if (value) {
              return `attribute_exists(${name(path ?? "$pk")})`;
            } else {
              return `attribute_not_exists(${name(path ?? "$pk")})`;
            }
          } else if (key === "$eq") {
            assertDefined(path);
            return `${name(path)} = ${val(value)}`;
          } else if (key === "$ne") {
            assertDefined(path);
            return `${name(path)} <> ${val(value)}`;
          } else if (key === "$gt") {
            assertDefined(path);
            return `${name(path)} > ${val(value)}`;
          } else if (key === "$gte") {
            assertDefined(path);
            return `${name(path)} >= ${val(value)}`;
          } else if (key === "$lt") {
            assertDefined(path);
            return `${name(path)} < ${val(value)}`;
          } else if (key === "$lte") {
            assertDefined(path);
            return `${name(path)} <= ${val(value)}`;
          } else if (key === "$beginsWith") {
            assertDefined(path);
            return `begins_with(${name(path)}, ${val(value)})`;
          } else if (key === "$between") {
            assertDefined(path);
            if (Array.isArray(value) && value.length === 2) {
              return `${name(path)} BETWEEN ${val(value[0])} AND ${val(
                value[1]
              )}`;
            } else {
              throw new Error(`Invalid $between: ${JSON.stringify(value)}`);
            }
          } else {
            return `${name(path ? `${path}.${key}` : key)} = ${val(value)}`;
          }
        }
      }
    }

    async delete(item: any, ...rest: any[]): Promise<any> {
      if (Array.isArray(item) || rest.length > 0) {
        const items = Array.isArray(item) ? item : [item, ...rest];
        const failed: any[] = [];
        const response = await this.client.send(
          new BatchWriteCommand({
            RequestItems: {
              [this.tableName]: items.map((item) => ({
                DeleteRequest: {
                  Key: createKey(item),
                },
              })),
            },
          })
        );
        return {
          unprocessedItems: response.UnprocessedItems,
        };
      } else if (rest.length === 0) {
        await this.client.send(
          new DeleteCommand({
            TableName: this.tableName,
            Key: createKey(item),
          })
        );
        // TODO: support return values, condition expressions, etc.
        return {};
      } else {
        throw new Error(`Invalid arguments: ${[item, ...rest]}`);
      }
    }

    // @ts-ignore
    async query<const Q extends QueryExpression<E>>(
      query: Q,
      options?: {
        nextToken?: string;
      }
    ): Promise<{
      items: QueriedItem<E, Q>[];
      nextToken: string | undefined;
    }> {
      let keyConditionExpression = Object.values(entities)
        .map((e) => createKeyConditionExpression(e))
        .find((v) => v !== undefined);
      if (keyConditionExpression === undefined) {
        throw new Error(`Invalid Query: ${JSON.stringify(query)}`);
      }

      const params = {
        TableName: this.tableName,
        ...keyConditionExpression,
        ConsistentRead: true,
        // ExclusiveStartKey: exclusiveStartKey
      } satisfies QueryCommandInput;
      const response = await this.client.send(new QueryCommand(params));

      return {
        items:
          response.Items?.map(parseItem).filter(
            (v): v is NotUndefined<typeof v> => v !== undefined
          ) ?? [],
        nextToken: response.LastEvaluatedKey
          ? JSON.stringify(response.LastEvaluatedKey)
          : undefined,
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
            if (isComparator(skV)) {
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

    // @ts-ignore
    async scan(options?: { nextToken?: string }): Promise<{
      items: valueOf<E[keyof E]>[] | undefined;
      nextToken: string | undefined;
    }> {
      const command = new ScanCommand({
        TableName: this.tableName,
        ExclusiveStartKey: options?.nextToken
          ? JSON.parse(options.nextToken)
          : undefined,
      });
      const response = await this.client.send(command);

      return {
        items: response.Items?.map(parseItem),
        nextToken: response.LastEvaluatedKey
          ? JSON.stringify(response.LastEvaluatedKey)
          : undefined,
      };
    }
  };

  function parseKey(key: any) {}

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
    const $pk = entity.traits.pk
      .map((pk: keyof typeof key) => key[pk])
      .join("#");
    const $sk = entity.traits.sk
      ?.map((sk: keyof typeof key) => key[sk])
      ?.join("#");
    return { $pk, $sk };
  }
}

export interface TableSpec<E extends Entities = Entities> {
  entities: E;

  Query: QueryExpression<E>;
  QueryItem<Q extends QueryExpression<E>>(): QueriedItem<E, Q>;

  new (props: TableProps): Table<E>;
}

export type Table<E extends Entities = Entities> = {
  [entityName in keyof E]: E[entityName]["traits"]["indexes"] extends undefined
    ? {}
    : {
        [index in keyof E[entityName]["traits"]["indexes"]]: {
          <
            const Q extends IndexQueryExpression<
              E[entityName]["traits"]["indexes"][index],
              E[entityName]
            >
          >(
            query: Q,
            options?: {
              nextToken?: string;
            }
          ): Promise<{
            items: valueOf<E[entityName]>[];
            nextToken?: string;
          }>;

          iter: <
            const Q extends IndexQueryExpression<
              E[entityName]["traits"]["indexes"][index],
              E[entityName]
            >
          >(
            query: Q,
            options?: {
              nextToken?: string;
            }
          ) => AsyncIterable<valueOf<E[entityName]>>;
        };
      };
} & {
  readonly tableName: string;
  readonly entities: E;
  readonly client: DynamoDBDocumentClient;

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

  delete<Key extends KeysOfEntities<E>>(key: Key): Promise<{}>;
  delete<const Keys extends KeysOfEntities<E>[]>(
    ...items: Keys
  ): Promise<{
    unprocessedKeys: valueOf<E[keyof E]>[];
  }>;
  delete<const Keys extends KeysOfEntities<E>[]>(
    items: Keys
  ): Promise<{
    unprocessedKeys: valueOf<E[keyof E]>[] | undefined;
  }>;

  update<const Key extends UpdateRequest<E>>(
    item: Key,
    options?: {
      where?: ConditionExpression<E>;
    }
  ): Promise<{}>;

  query: {
    <const Q extends QueryExpression<E>>(
      query: Q,
      options?: {
        nextToken?: string;
      }
    ): Promise<{
      items: QueriedItem<E, Q>[];
      nextToken?: string;
    }>;

    iter: <const Q extends QueryExpression<E>>(
      query: Q,
      options?: {
        nextToken?: string;
      }
    ) => AsyncIterable<QueriedItem<E, Q>>;
  };

  scan: {
    (options?: { nextToken?: string }): Promise<{
      items: valueOf<E[keyof E]>[];
      nextToken: string | undefined;
    }>;

    iter: (options?: {
      nextToken?: string;
    }) => AsyncIterable<valueOf<E[keyof E]>>;
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
