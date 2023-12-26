import type { Simplify, Widen } from "../util.js";
import type { valueOf } from "../valueOf.js";
import { QueryExpression, FilterExpression } from "./condition.js";
import type { Entities, Entity } from "./entity.js";
import type { KeysOfEntities } from "./key.js";

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
      : Q[sk] extends FilterExpression<any>
      ? true
      : false
    : false
  : false;

type StaticKeys<Q> = {
  [k in keyof Q]: Q[k] extends string | number | boolean | null | undefined
    ? k
    : never;
}[keyof Q];
