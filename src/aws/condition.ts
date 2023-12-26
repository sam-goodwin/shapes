import type { valueOf } from "../valueOf.js";
import type { Entities, Entity } from "./entity.js";
import type { PK } from "./key.js";

export type QueryExpression<E extends Entities> = {
  [k in keyof E]: PK<E[k]> & SortKeyExpression<E[k]>;
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
            [k in sk]: FilterExpression<
              valueOf<E>[Extract<sk, keyof valueOf<E>>]
            >;
          } & {
            [k in sks[number]]?: never;
          })
        | (SortKeyExpression<E, sks, Exclude> extends never
            ? never
            : {
                [k in sk]: valueOf<E>[Extract<k, keyof valueOf<E>>];
              } & SortKeyExpression<E, sks, Exclude>)
  : never;

export function isFilterExpression(a: any): a is FilterExpression<any> {
  return (
    a &&
    typeof a === "object" &&
    ("$gte" in a ||
      "$gt" in a ||
      "$lt" in a ||
      "$lte" in a ||
      "$beginsWith" in a ||
      "$between" in a)
  );
}

export type FilterExpression<V> =
  | FilterExpression.GTE<V>
  | FilterExpression.GT<V>
  | FilterExpression.LT<V>
  | FilterExpression.LTE<V>
  | FilterExpression.BeginsWith<V>
  | FilterExpression.Between<V>;

export declare namespace FilterExpression {
  export type GTE<V> = {
    $gte: V;
  };

  export type GT<V> = {
    $gt: V;
  };

  export type LT<V> = {
    $lt: V;
  };

  export type LTE<V> = {
    $lte: V;
  };

  export type BeginsWith<V> = {
    $beginsWith: V;
  };

  export type Between<V> = {
    $between: [V, V];
  };
}

export function isGTE(a: any): a is FilterExpression.GTE<string | number> {
  return a && typeof a === "object" && "$gte" in a;
}

export function isGT(a: any): a is FilterExpression.GT<string | number> {
  return a && typeof a === "object" && "$gt" in a;
}

export function isLT(a: any): a is FilterExpression.LT<string | number> {
  return a && typeof a === "object" && "$lt" in a;
}

export function isLTE(a: any): a is FilterExpression.LTE<string | number> {
  return a && typeof a === "object" && "$lte" in a;
}

export function isBeginsWith(
  a: any
): a is FilterExpression.BeginsWith<string | number> {
  return a && typeof a === "object" && "$beginsWith" in a;
}

export function isBetween(
  a: any
): a is FilterExpression.Between<string | number> {
  return a && typeof a === "object" && "$between" in a;
}
