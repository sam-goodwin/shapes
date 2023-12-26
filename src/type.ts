import type { iSchema } from "./schema.js";
import type { iTraits } from "./trait.js";
import type { Simplify } from "./util.js";
import type { valueOfShape } from "./valueOf.js";

export type Shape = {
  [property: string]: iType;
};
export type Kind = keyof Types;
export type iType =
  | iNever
  | iAny
  | iUnknown
  | iVoid
  | iUndefined
  | iNull
  | iBoolean
  | iNumber
  | iBigInt
  | iString
  | iLiteral<any>
  | iArray<any>
  | iObject<Shape>
  | iClass<Shape>
  | iUnion<any>
  | iEnum<string[]>
  | iNativeEnum<EnumLike>
  | iThis<any>;

export type iThis<T> = iSchema<"this"> & { self: T };
export type iNever = iSchema<"never">;
export type iAny = iSchema<"any">;
export type iUnknown = iSchema<"unknown">;
export type iVoid = iSchema<"void">;
export type iUndefined = iSchema<"undefined">;
export type iNull = iSchema<"null">;
export type iBoolean = iSchema<"boolean">;
export type iNumber = iSchema<"number">;
export type iBigInt = iSchema<"bigint">;
export type iString = iSchema<"string">;
export type iSymbol = iSchema<"symbol">;
export type iLiteral<V = any> = iSchema<"literal"> & {
  value: V;
};
export type iArray<T extends iType = iType> = iSchema<"array"> & {
  item: T;
};
export type iObject<S extends Shape = Shape> = iSchema<"object"> & {
  shape: S;
  keyof(): iEnum<Extract<keyof S, string>[]>;
  extend<S2 extends Shape>(
    shape: S2
  ): iObject<Simplify<S2 & Omit<S, keyof S2>>>;
  merge<Other extends iObject>(
    other: Other
  ): iObject<Simplify<Other["shape"] & Omit<S, keyof Other["shape"]>>>;
  pick<K extends keyof S>(...keys: K[]): iObject<Simplify<Pick<S, K>>>;
  pick<
    Mask extends {
      [k in keyof S]?: true | never;
    }
  >(
    mask: Mask
  ): iObject<Pick<S, Extract<keyof Mask, keyof S>>>;
  omit<K extends keyof S>(...keys: K[]): iObject<Omit<S, K>>;
  omit<
    Mask extends {
      [k in keyof S]?: true | never;
    }
  >(
    mask: Mask
  ): iObject<Omit<S, keyof Mask>>;
  partial(): iObject<{
    [prop in keyof S]: iUnion<S[prop] | iUndefined>;
  }>;
};
export interface iClass<S extends Shape = Shape, Super = {}>
  extends iSchema<"class"> {
  shape: S;
  new (input: valueOfShape<S, this>): valueOfShape<S, this> & Super;
  keyof(): iEnum<Extract<keyof S, string>[]>;

  extend<Self extends iClass<S>, Other extends Shape>(
    this: Self,
    shape: Other
  ): iClass<Simplify<Other & Omit<Self["shape"], keyof Other>>>;

  pick<Self extends iClass<S>, K extends keyof S>(
    ...keys: K[]
  ): iClass<Simplify<Pick<S, K>>>;
  pick<
    Mask extends {
      [k in keyof S]?: true | never;
    }
  >(
    mask: Mask
  ): iClass<Pick<S, Extract<keyof Mask, keyof S>>>;
  omit<K extends keyof S>(...keys: K[]): iClass<Omit<S, K>>;
  omit<
    Mask extends {
      [k in keyof S]?: true | never;
    }
  >(
    mask: Mask
  ): iClass<Omit<S, keyof Mask>>;
  partial(): iClass<{
    [prop in keyof S]: iUnion<S[prop] | iUndefined>;
  }>;
  members<Self, Members extends { [key: string]: any }>(
    this: Self,
    props: Members
  ): Self extends {
    new (...args: any): any;
  } & infer Rest
    ? Rest & {
        new (input: valueOfShape<S, Self>): valueOfShape<S, Self> & Members;
      }
    : never;
  static<Props extends { [key: string]: any }>(props: Props): this & Props;
}

export type iUnion<T = iType> = iSchema<"union"> & {
  options: T[];
};

export type iEnum<T extends string[] = string[]> = iSchema<"enum"> & {
  options: T[];
  enum: {
    [Element in T[number]]: Element;
  };
};

export type iNativeEnum<T extends EnumLike = EnumLike> = iSchema<"enum"> & {
  options: (keyof T)[];
  enum: {
    [K in keyof T]: T[K];
  };
};

export type EnumLike = {
  [key: string]: string | number;
};

export type Types = {
  never(): iNever;
  any(): iAny;
  unknown(): iUnknown;
  void(): iVoid;
  null(): iNull;
  undefined(): iUndefined;
  boolean(): iBoolean;
  string(): iString;
  symbol(): iSymbol;
  number(): iNumber;
  bigint(): iBigInt;
  literal<const V>(value: V): iLiteral<V>;
  array<Item extends iType>(item: Item): iArray<Item>;
  object<S extends Shape>(shape: S): iObject<S>;
  class<S extends Shape, Traits extends iTraits = {}>(
    shape: S,
    traits?: Traits
  ): iClass<S, Traits>;
  union<T extends iType[]>(...options: T): iUnion<T[number]>;
  enum<T extends string[]>(...options: T): iEnum<T>;
  nativeEnum<T extends EnumLike>(options: T): iNativeEnum<T>;
  this(): iThis<undefined>;
  this<T>(): iThis<T>;
  lazy<T>(fn: () => T): T;
};
