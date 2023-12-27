import type {
  iUndefined,
  iVoid,
  iNull,
  iBoolean,
  iNumber,
  iString,
  iLiteral,
  iArray,
  iObject,
  Shape,
  iThis,
  iUnion,
  iEnum,
  iNativeEnum,
  EnumLike,
  lit,
} from "./type.js";
import type { Simplify, OptionalKeys } from "./util.js";

export type valueOf<Type, Self = never> = Type extends lit
  ? Type
  : Type extends iUndefined
  ? undefined
  : Type extends iVoid
  ? void
  : Type extends iNull
  ? null
  : Type extends iBoolean
  ? boolean
  : Type extends iNumber
  ? number
  : Type extends iString
  ? string
  : Type extends iLiteral<infer V>
  ? V
  : Type extends iArray<infer Item>
  ? valueOf<Item, Self>[]
  : Type extends iObject<infer S extends Shape>
  ? valueOfShape<S, Type>
  : Type extends new (...input: any) => infer U
  ? U
  : Type extends iThis<infer S>
  ? S extends undefined
    ? valueOf<Self>
    : S
  : Type extends iUnion<infer U>
  ? valueOf<U, Self>
  : Type extends iEnum<infer U>
  ? U[number]
  : Type extends iNativeEnum<infer U extends EnumLike>
  ? U[keyof U]
  : never;

export type valueOfShape<S extends Shape, Self> = Simplify<
  {
    [K in keyof Omit<S, OptionalKeys<S>>]: valueOf<S[K], Self>;
  } & {
    [K in keyof Pick<S, OptionalKeys<S>>]+?: valueOf<S[K], Self>;
  }
>;

// TODO: modify to map things like Sets to marshalled forms
export type marshalledValueOf<Type, Self = never> = valueOf<Type, Self>;
