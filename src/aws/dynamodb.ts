import {
  BatchGetCommand,
  BatchGetCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  BatchWriteCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import type { Shape, iClass } from "../type.js";
import type { valueOf, valueOfShape } from "../valueOf.js";
import type { iSchema } from "../schema.js";
import { itty as i } from "../itty.js";
import { Widen } from "../util.js";

interface TableProps {
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
    }

    async get(key: unknown, ...rest: unknown[]): Promise<any> {
      if (Array.isArray(key) || rest.length > 1) {
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
            const keyStr = serializeKey(item);
            const entity = entities[item.$type];
            return [keyStr, entity.parse(item) as any];
          }) ?? []
        );

        const items = keys.map((key, i) => {
          return itemsMap.get(serializeKey(key));
        });

        return {
          items,
          unprocessedKeys,
          consumedCapacity: response.ConsumedCapacity,
        };
      } else if (rest.length === 0) {
        if (!isKey(key)) {
          throw new Error(`Invalid Key: ${JSON.stringify(key)}`);
        }
        const entity = entities[key.$type];
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
          item: entity.parse(response.Item),
          consumedCapacity: response.ConsumedCapacity,
        };
      } else {
        throw new Error(`Invalid arguments: ${[key, ...rest]}`);
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
                  Item: getEntityFor(item).marshall<any>(item) as any,
                },
              })),
            },
          })
        );
        return {
          unprocessedItems: response.UnprocessedItems,
          consumedCapacity: response.ConsumedCapacity,
        };
      } else if (rest.length === 0) {
        const entity = getEntityFor(item);

        const response = await this.client.send(
          new PutCommand({
            TableName: this.tableName,
            Item: entity.marshall<any>(item) as any,
          })
        );
        return {
          consumedCapacity: response.ConsumedCapacity,
        };
      } else {
        throw new Error(`Invalid arguments: ${[item, ...rest]}`);
      }
    }
  };

  function getEntityFor(item: any) {
    if (!isKey(item)) {
      throw new Error(`Invalid Key: ${JSON.stringify(item)}`);
    }
    const entity = entities[item.$type];
    if (entity === undefined) {
      throw new Error(`Unknown Entity: ${item.$type}`);
    }
    return entity;
  }

  function serializeKey({ $pk, $sk }: { $pk: string; $sk: string }) {
    return `${$pk}|${$sk}`;
  }

  function createKey(key: any) {
    if (!isKey(key)) {
      throw new Error(`Invalid Key: ${JSON.stringify(key)}`);
    }
    const entity = entities[key.$type];
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

  new (client: DynamoDBDocumentClient): Table<E>;
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
    consumedCapacity: number | undefined;
  }>;
  put<const Items extends BatchPutItems<E>>(
    ...items: Items
  ): Promise<{
    unprocessedKeys: valueOf<E[keyof E]>[];
    consumedCapacity: number | undefined;
  }>;
  put<const Items extends BatchPutItems<E>>(
    items: Items
  ): Promise<{
    unprocessedKeys: valueOf<E[keyof E]>[] | undefined;
    consumedCapacity: number | undefined;
  }>;
  query<const Q extends QueryExpression<E>>(
    query: Q,
    options?: {
      lastEvaluatedKey?: LastEvaluatedKey<E, Q>;
    }
  ): Promise<{
    items: QueriedItem<E, Q>[];
    lastEvaluatedKey: LastEvaluatedKey<E, Q> | undefined;
    consumedCapacity: number | undefined;
  }>;
};

type Key<
  FQN extends string = string,
  Data extends Record<string, any> = any
> = {
  $type: FQN;
} & Data;

export function isKey(a: any): a is Key {
  return a && typeof a === "object" && "$type" in a;
}

type KeyOfEntity<E extends Entity> = Simplify<
  {
    $type: E["traits"]["fqn"];
  } & (E["traits"]["sk"] extends undefined ? PK<E> : PK<E> & SK<E>)
>;

type ShortKeyOfEntity<E extends Entity> = Simplify<
  {
    [pk in E["traits"]["pk"][number]]: valueOfShape<E["shape"], any>[Extract<
      pk,
      keyof valueOfShape<E["shape"], any>
    >];
  } & {
    [sk in E["traits"]["sk"][number]]: valueOfShape<E["shape"], any>[Extract<
      sk,
      keyof valueOfShape<E["shape"], any>
    >];
  }
>;

type KeysOfEntities<E extends Entities> = {
  [K in keyof E]: KeyOfEntity<E[K]>;
}[keyof E];

type PK<E extends Entity> = {
  [pk in keyof Pick<
    valueOf<E>,
    Extract<E["traits"]["pk"][number], keyof valueOf<E>>
  >]: valueOf<E>[Extract<pk, keyof valueOf<E>>];
};

type SK<E extends Entity> = {
  [sk in keyof Pick<
    valueOf<E>,
    Extract<
      Extract<E["traits"]["sk"], readonly string[]>[number],
      keyof valueOf<E>
    >
  >]: valueOf<E>[Extract<sk, keyof valueOf<E>>];
};

type Entities<E extends Entity = Entity> = Record<string, E>;

type GotItem<E extends Entities, K extends KeysOfEntities<E>> = {
  [k in keyof E]: valueOf<E[k]> extends Widen<Key>
    ? valueOf<E[k], k> & Key
    : never;
}[keyof E];

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
          ? (valueOf<E[k]> & Keys[i]) | undefined
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

export type QueryExpression<E extends Entities> = {
  [k in keyof E]: Simplify<PK<E[k]> & SortKeyExpression<E[k]>>;
}[keyof E];

type SortKeyExpression<
  E extends Entity,
  SK extends readonly (string | number | symbol)[] | undefined =
    | E["traits"]["sk"]
    | undefined,
  Exclude = never
> = SK extends readonly [
  infer sk extends keyof E["shape"],
  ...infer sks extends (keyof E["shape"])[]
]
  ? sk extends Exclude
    ? SortKeyExpression<E, sks, Exclude>
    :
        | (
            | { [s in SK[number]]?: never }
            | {
                [k in sk]: valueOf<E>[Extract<k, keyof valueOf<E>>];
              }
          )
        | ({
            [k in sk]: FilterExpression<
              valueOf<E>[Extract<sk, keyof valueOf<E>>]
            >;
          } & {
            [k in sks[number]]?: never;
          })
        | ({
            [k in sk]: valueOf<E>[Extract<k, keyof valueOf<E>>];
          } & SortKeyExpression<E, sks, Exclude>)
  : {};

type FilterExpression<V> =
  | {
      $gte: V;
    }
  | {
      $gt: V;
    }
  | {
      $lt: V;
    }
  | {
      $lte: V;
    }
  | {
      $beginsWith: V;
    }
  | {
      $between: [V, V];
    };

type QueriedItem<E extends Entities, Q extends QueryExpression<E>> = Simplify<
  LastEvaluatedKey<E, Q> &
    valueOf<
      E[{
        [e in keyof E]: IsQueryCompatible<E[e], Q> extends true ? e : never;
      }[keyof E]]
    >
>;

export type LastEvaluatedKey<
  E extends Entities,
  Q extends QueryExpression<E>
> = Simplify<
  Extract<
    KeysOfEntities<E>,
    Widen<{
      [k in keyof Q]: Q[k] extends undefined | null | boolean | number | string
        ? Q[k]
        : Q[k] extends FilterExpression<infer V extends string | number>
        ? `${V}${string}`
        : any;
    }>
  > & {
    [k in keyof Q]: Q[k] extends undefined | null | boolean | number | string
      ? Q[k]
      : Q[k] extends FilterExpression<infer V extends string | number>
      ? `${V}${string}`
      : any;
  }
>;

type IsQueryCompatible<
  E extends Entity,
  Q extends QueryExpression<Entities>
> = E["traits"]["pk"][number] extends StaticKeys<Q>
  ? Exclude<keyof Q, E["traits"]["pk"][number]> extends never
    ? true
    : Exclude<
        keyof Q,
        E["traits"]["pk"][number]
      > extends E["traits"]["sk"][number]
    ? true
    : false
  : E["traits"]["sk"] extends undefined
  ? true
  : E["traits"]["sk"] extends readonly string[]
  ? IsQueryMatchRelevantToSK<Q, E["traits"]["sk"]>
  : false;

type IsQueryMatchRelevantToSK<
  Q extends QueryExpression<Entities>,
  SK extends readonly string[]
> = SK extends [infer sk, ...infer sks extends string[]]
  ? sk extends keyof Q
    ? Q[sk] extends string | number | null
      ? IsQueryMatchRelevantToSK<Q, sks>
      : Q[sk] extends FilterExpression<any>
      ? true
      : false
    : false
  : false;

type StaticKeys<Q extends QueryExpression<Entities>> = {
  [k in keyof Q]: Q[k] extends string | number | boolean | null | undefined
    ? k
    : never;
}[keyof Q];

type Simplify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type GetEntity<E extends Entity> = {
  get<const K extends ShortKeyOfEntity<E>>(
    key: K
  ): Promise<(valueOf<E> & K) | undefined>;
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
      [i in keyof Keys]: Extract<valueOf<E>, Keys[i]> | undefined;
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
  //   consumedCapacity: number | undefined;
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

type AllowedPrimaryKeys<S> = keyof Pick<
  S,
  Extract<
    {
      [K in keyof S]: valueOf<S[K]> extends string | number | undefined
        ? K
        : never;
    }[keyof S],
    string
  >
>;

export type Entity<
  FQN extends string = string,
  S extends Shape = Shape,
  PK extends readonly AllowedPrimaryKeys<S>[] = readonly AllowedPrimaryKeys<S>[],
  SK extends readonly AllowedPrimaryKeys<S>[] = readonly AllowedPrimaryKeys<S>[]
> = iSchema<"class"> & {
  shape: S;
  traits: {
    fqn: FQN;
    pk: PK;
    sk: SK;
  };
};

export function entity<
  FQN extends string,
  S extends Shape,
  const PK extends readonly AllowedPrimaryKeys<S>[],
  const SK extends readonly AllowedPrimaryKeys<S>[] = []
>(
  fqn: FQN,
  options: {
    attributes: S;
    pk: PK;
    sk?: SK;
  }
): iClass<
  S,
  {
    $type: FQN;
  }
> & {
  traits: {
    pk: PK;
    sk: SK;
    fqn: FQN;
  };
  Key: {
    $infer: Simplify<
      {
        $type: FQN;
      } & {
        [pk in PK[number]]: valueOfShape<S, any>[Extract<
          pk,
          keyof valueOfShape<S, any>
        >];
      } & {
        [sk in SK[number]]: valueOfShape<S, any>[Extract<
          sk,
          keyof valueOfShape<S, any>
        >];
      }
    >;
    <
      Self extends Entity<FQN, S, PK, SK>,
      const K extends ShortKeyOfEntity<Self>
    >(
      this: Self,
      key: K
    ): Simplify<K & { $type: FQN }>;
  };
} {
  // @ts-ignore
  return class extends i.class<any>(options.attributes, {
    pk: options.pk,
    sk: options.sk!,
    fqn,
  }) {
    static Key<
      Self extends Entity<FQN, S, PK, SK>,
      K extends ShortKeyOfEntity<Self>
    >(this: Self, key: K) {
      return {
        $type: fqn,
        ...key,
      };
    }
    $type = fqn;
  };
}
