import type { Shape, iUnion, iUndefined } from "./type.js";

export type OptionalKeys<S extends Shape> = {
  [K in keyof S]: S[K] extends iUnion<infer U>
    ? U extends iUndefined
      ? K
      : never
    : never;
}[keyof S];

export type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

export type Widen<T> = T extends (...args: any[]) => any
  ? T
  : T extends undefined
  ? undefined
  : T extends null
  ? null
  : T extends boolean
  ? boolean
  : T extends number
  ? number
  : T extends string
  ? string
  : T extends symbol
  ? symbol
  : T extends bigint
  ? bigint
  : T extends any[]
  ? {
      [i in keyof T]: Widen<T[i]>;
    }
  : {
      [k in keyof T]: Widen<T[k]>;
    };
