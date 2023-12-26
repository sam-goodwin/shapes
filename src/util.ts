import type { Shape, iUnion, iUndefined } from "./type.js";

export type OptionalKeys<S extends Shape> = {
  [K in keyof S]: S[K] extends iUnion<infer U>
    ? U extends iUndefined
      ? K
      : never
    : never;
}[keyof S];

export type NotUndefined<T> = Exclude<T, undefined>;

export type Simplify<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

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
      [k in keyof T]: k extends "$type" ? T[k] : Widen<T[k]>;
    };

export function assertNever(x: never): never {
  throw new Error("Unexpected object: " + x);
}
