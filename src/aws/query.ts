import type { Simplify, Widen } from "../util.js";
import type { valueOf } from "../valueOf.js";
import type { Comparator } from "./condition.js";
import type { Entities, Entity } from "./entity.js";
import type { KeysOfEntities, PK } from "./key.js";

export type QueryExpression<E extends Entities> = {
  [k in keyof E]: E[k]["traits"]["sk"] extends []
    ? PK<E[k]>
    : PK<E[k]> & SortKeyExpression<E[k]>;
}[keyof E];

export type SortKeyExpression<
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
            [k in sk]: Comparator<valueOf<E>[Extract<sk, keyof valueOf<E>>]>;
          } & {
            [k in sks[number]]?: never;
          })
        | (SortKeyExpression<E, sks, Exclude> extends never
            ? never
            : {
                [k in sk]: valueOf<E>[Extract<k, keyof valueOf<E>>];
              } & SortKeyExpression<E, sks, Exclude>)
  : never;

export type QueriedItem<
  E extends Entities,
  Q extends QueryExpression<E>
> = valueOf<
  E[{
    [e in keyof E]: IsQueryCompatible<E[e], Q> extends true ? e : never;
  }[keyof E]]
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
        : Q[k] extends Comparator<infer V extends string | number>
        ? `${V}${string}`
        : any;
    }>
  > & {
    [k in keyof Q]: Q[k] extends undefined | null | boolean | number | string
      ? Q[k]
      : Q[k] extends Comparator<infer V extends string | number>
      ? `${V}${string}`
      : any;
  }
>;

type IsQueryCompatible<
  E extends Entity,
  Q
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

type IsQueryMatchRelevantToSK<Q, SK extends readonly string[]> = SK extends [
  infer sk,
  ...infer sks extends string[]
]
  ? sk extends keyof Q
    ? Q[sk] extends string | number | null
      ? IsQueryMatchRelevantToSK<Q, sks>
      : Q[sk] extends Comparator<any>
      ? true
      : false
    : false
  : false;

type StaticKeys<Q> = {
  [k in keyof Q]: Q[k] extends string | number | boolean | null | undefined
    ? k
    : never;
}[keyof Q];
