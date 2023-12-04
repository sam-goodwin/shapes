export const Itty = Symbol.for("itty");

export type valueOf<Type, Self = never> = Type extends iUndefined
  ? undefined
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
  ? Simplify<
      {
        [K in keyof Omit<S, OptionalKeys<S>>]: valueOf<S[K], Type>;
      } & {
        [K in keyof Pick<S, OptionalKeys<S>>]+?: valueOf<S[K], Type>;
      }
    >
  : Type extends new (...input: any) => infer U
  ? U
  : Type extends iThis<infer S>
  ? S extends undefined
    ? valueOf<Self>
    : S
  : Type extends iUnion<infer U>
  ? valueOf<U, Self>
  : never;

type OptionalKeys<S extends Shape> = {
  [K in keyof S]: S[K] extends iUnion<infer U>
    ? U extends iUndefined
      ? K
      : never
    : never;
}[keyof S];

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

interface iSchema<K extends iKind = iKind> {
  [Itty]: K;
  [Symbol.hasInstance]<Self extends iType>(
    this: Self,
    val: unknown
  ): val is valueOf<Self, Self>;
  describe(text: string): this;
  parse<Self extends new (input: any) => any>(
    this: Self,
    value: any
  ): InstanceType<Self>;
  parse<Self extends iType>(this: Self, value: any): valueOf<Self, never>;
  optional<Self extends iType>(
    this: Self
  ): Self extends iUnion<infer U>
    ? iUnion<U | iUndefined>
    : iUnion<iUndefined | Self>;
  nullable(): this extends iUnion<infer U>
    ? iUnion<U | iNull>
    : iUnion<iNull | iType>;
  nullish(): this extends iUnion<infer U>
    ? iUnion<U | iUndefined | iNull>
    : iUnion<iNull | iUndefined | iType>;
}

type Shape = {
  [property: string]: iType;
};
type iKind = keyof Types;
type iType =
  | iThis<any>
  | iUndefined
  | iNull
  | iBoolean
  | iNumber
  | iString
  | iLiteral<any>
  | iArray<any>
  | iObject<Shape>
  | iClass<Shape>
  | iUnion<any>;

type iThis<T> = iSchema<"this"> & { self: T };
type iUndefined = iSchema<"undefined">;
type iNull = iSchema<"null">;
type iBoolean = iSchema<"boolean">;
type iNumber = iSchema<"number">;
type iString = iSchema<"string">;
type iLiteral<V> = iSchema<"literal"> & {
  literal: V;
};
type iArray<T extends iType> = iSchema<"array"> & {
  item: T;
};
type iObject<S extends Shape> = iSchema<"object"> & {
  shape: S;
};
interface iClass<S extends Shape> extends iSchema<"class"> {
  shape: S;
  new (input: {
    [K in keyof S]: valueOf<S[K], this>;
  }): {
    [K in keyof S]: valueOf<S[K], this>;
  };
}

type iUnion<T extends iType> = iSchema<"union"> & {
  options: T[];
};
type Types = {
  this(): iThis<undefined>;
  this<T>(): iThis<T>;
  null(): iNull;
  undefined(): iUndefined;
  boolean(): iBoolean;
  string(): iString;
  number(): iNumber;
  literal<V>(...values: V[]): iLiteral<V>;
  array<Item extends iType>(item: Item): iArray<Item>;
  object<S extends Shape>(shape: S): iObject<S>;
  class<S extends Shape>(shape: S): iClass<S>;
  union<T extends iType>(...options: T[]): iUnion<T>;
};

type Itty = Types & {
  describe(text: string): Itty;
} & {
  [K in keyof Types as `is${K extends `${infer X}${infer XS}`
    ? `${Uppercase<X>}${XS}`
    : never}`]: (value: any) => value is Extract<
    iType,
    {
      [Itty]: K;
    }
  >;
};

function createItty<Props extends Record<string, any>>(props: Props): Itty {
  return new Proxy(
    {},
    {
      get: (_, type) => {
        if (typeof type === "string" && type.startsWith("is")) {
          return (value: any) =>
            value &&
            typeof value === "object" &&
            value[Itty] === (type.slice(2).toLowerCase() as iKind);
        } else if (type === "describe") {
          return (description: string) =>
            createItty({
              description,
            });
        } else {
          return (shape: any) => {
            const schema = {
              [Itty]: type,
              ...props,
              ...shape,
              parse(value: any) {
                if (type === "literal") {
                  if (!shape.literal.includes(value)) {
                    // TODO: support objects and array primitive values
                    throw new Error("Expected a literal");
                  }
                  return value;
                } else if (type === "object") {
                  if (typeof value !== "object" || value === null) {
                    throw new Error("Expected an object");
                  }
                  const result: any = {};
                  for (const key in shape) {
                    result[key] = shape[key].parse(value[key]);
                  }
                  return result;
                } else if (type === "array") {
                  if (!Array.isArray(value)) {
                    throw new Error("Expected an array");
                  }
                  return value.map(shape.parse);
                } else if (typeof value === type) {
                  return value;
                }
              },
            };
            if (type === "class") {
              class Schema {
                constructor(value: any) {
                  Object.assign(this, schema.parse(value));
                }
              }
              Object.assign(Schema, schema);
              return Schema;
            } else {
              return schema;
            }
          };
        }
      },
    }
  ) as any;
}

export default createItty({}) as Itty;
