export type valueOf<Type, Self = never> = Type extends iUndefined
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
  : never;

type valueOfShape<S extends Shape, Self> = Simplify<
  {
    [K in keyof Omit<S, OptionalKeys<S>>]: valueOf<S[K], Self>;
  } & {
    [K in keyof Pick<S, OptionalKeys<S>>]+?: valueOf<S[K], Self>;
  }
>;

type OptionalKeys<S extends Shape> = {
  [K in keyof S]: S[K] extends iUnion<infer U>
    ? U extends iUndefined
      ? K
      : never
    : never;
}[keyof S];

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] } & {};

type Shape = {
  [property: string]: iType;
};
type Kind = keyof Types;
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
  | iThis<any>;

export type iThis<T> = Schema<"this"> & { self: T };
export type iNever = Schema<"never">;
export type iAny = Schema<"any">;
export type iUnknown = Schema<"unknown">;
export type iVoid = Schema<"void">;
export type iUndefined = Schema<"undefined">;
export type iNull = Schema<"null">;
export type iBoolean = Schema<"boolean">;
export type iNumber = Schema<"number">;
export type iBigInt = Schema<"bigint">;
export type iString = Schema<"string">;
export type iSymbol = Schema<"symbol">;
export type iLiteral<V = any> = Schema<"literal"> & {
  value: V;
};
export type iArray<T extends iType = iType> = Schema<"array"> & {
  item: T;
};
export type iObject<S extends Shape = Shape> = Schema<"object"> & {
  shape: S;
};
export interface iClass<S extends Shape = Shape> extends Schema<"class"> {
  shape: S;
  new (input: valueOfShape<S, this>): valueOfShape<S, this>;
}
export type iUnion<T extends iType = iType> = Schema<"union"> & {
  options: T[];
};

type Types = {
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
  literal<V>(value: V): iLiteral<V>;
  array<Item extends iType>(item: Item): iArray<Item>;
  object<S extends Shape>(shape: S): iObject<S>;
  class<S extends Shape>(shape: S): iClass<S>;
  union<T extends iType[]>(...options: T): iUnion<T[number]>;
  this(): iThis<undefined>;
  this<T>(): iThis<T>;
  lazy<T>(fn: () => T): T;
};

type Itty = Types & {
  describe(text: string): Itty;
  coerce: Itty;
} & {
  [K in keyof Types as `is${K extends `${infer X}${infer XS}`
    ? `${Uppercase<X>}${XS}`
    : never}`]: (value: any) => value is Extract<
    iType,
    {
      kind: K;
    }
  >;
};

export interface SchemaOptions<K extends Kind> {
  kind: K;
  description?: string;
  [key: string]: any;
}

export interface Schema<K extends Kind> {
  kind: K;
  description: string | undefined;
}

export class Schema<K extends Kind> {
  readonly props: SchemaOptions<K>;
  constructor(props: SchemaOptions<K> | K) {
    if (typeof props === "string") {
      this.props = { kind: props };
    } else {
      this.props = props;
    }
    Object.assign(this, props);
  }

  private clone(props: any): this {
    return new (this.constructor as any)({
      ...this,
      ...props,
    });
  }

  public describe(description: string): this {
    return this.clone({ description });
  }

  public optional<Self extends iType>(this: Self) {
    return itty.union(this, itty.undefined());
  }

  public nullable<Self extends iType>(this: Self) {
    return itty.union(this, itty.null());
  }

  public nullish<Self extends iType>(this: Self) {
    return itty.union(this, itty.null(), itty.undefined());
  }

  public parse<Self extends new (input: any) => any>(
    this: Self,
    value: any
  ): InstanceType<Self>;
  public parse<Self extends iType>(
    this: Self,
    value: any
  ): valueOf<Self, never>;
  public parse(value: any, self?: iType | undefined): any {
    const kind = this.kind;
    if (typeof value === kind) {
      return value;
    } else if (kind === "any" || kind === "unknown") {
      return value;
    } else if (kind === "never") {
      throw new Error("Received never");
    } else if (kind === "void") {
      if (value !== undefined) {
        throw new Error("Expected void");
      }
      return value;
    } else if (kind === "bigint" && typeof value === "number") {
      return BigInt(value);
    } else if (kind === "literal") {
      if (!(this as any as iLiteral).value === value) {
        // TODO: support objects and array primitive values
        throw new Error("Expected a literal");
      }
      return value;
    } else if (kind === "object" || kind === "class") {
      const obj: iObject<any> | iClass<any> = this as any;
      if (typeof value !== "object" || value === null) {
        throw new Error("Expected an object");
      }
      const result: any = {};
      for (const [key, schema] of Object.entries(obj.shape) as [
        string,
        iType
      ][]) {
        if (key in value) {
          // @ts-ignore
          result[key] = schema.parse(value[key], this);
        } else if (!itty.isUndefined(schema)) {
          if (itty.isUnion(schema)) {
            if (schema.props.options.some(itty.isUndefined)) {
              continue;
            }
          }
          throw new Error(`Expected ${key} in object`);
        }
      }
      if (kind === "class") {
        // @ts-ignore
        return new this(result);
      }
      return result;
    } else if (kind === "this") {
      if (self === undefined) {
        throw new Error(`this is undefined`);
      }
      // @ts-ignore
      return self.parse(value, self);
    } else if (kind === "array") {
      if (!Array.isArray(value)) {
        throw new Error("Expected an array");
      }
      return value.map((item) =>
        // @ts-ignore
        (this as any as iArray).item.parse(item, self)
      );
    } else if (kind === "union") {
      for (const option of (this as any as iUnion).options) {
        try {
          // @ts-ignore
          return option.parse(value, self);
        } catch (error) {
          debugger;
        }
      }
      throw new Error("Expected one of the union options");
    } else {
      throw new Error(`Unsupported type ${kind.toString()}`);
    }
  }
}

function createItty<Props extends Record<string, any>>(props: Props): Itty {
  return new Proxy(
    {},
    {
      get: (_, kind) => {
        if (typeof kind === "string" && kind.startsWith("is")) {
          return (value: any) =>
            value &&
            (typeof value === "object" || typeof value === "function") &&
            value.kind === (kind.slice(2).toLowerCase() as Kind);
        } else if (kind === "describe") {
          return (description: string) =>
            createItty({
              ...props,
              description,
            });
        } else {
          return (...args: any[]) => {
            const [shape] = args;

            const inputProps: any = {
              ...props,
              kind,
              args,
            };
            if (kind === "union") {
              inputProps.options = args;
            } else if (kind === "literal") {
              inputProps.value = args[0];
            } else if (kind === "array") {
              inputProps.item = args[0];
            } else if (kind === "object" || kind === "class") {
              inputProps.shape = args[0];
            }

            const schema = new Schema(inputProps);
            if (kind === "class") {
              class _Schema {
                constructor(value: any) {
                  Object.assign(this, value);
                }
              }
              Object.assign(_Schema, schema);
              for (const prop of Object.getOwnPropertyNames(Schema.prototype)) {
                const value = (schema as any)[prop];
                if (typeof value === "function" && prop !== "constructor") {
                  Object.defineProperty(_Schema, prop, {
                    value,
                  });
                }
              }
              return _Schema;
            } else {
              return schema;
            }
          };
        }
      },
    }
  ) as any;
}

export const itty = createItty({}) as Itty;

export default itty;
