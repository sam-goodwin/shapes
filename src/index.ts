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
  : Type extends iEnum<infer U>
  ? U[number]
  : Type extends iNativeEnum<infer U extends EnumLike>
  ? U[keyof U]
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
  | iEnum<string[]>
  | iNativeEnum<EnumLike>
  | iThis<any>;

export type iThis<T> = ISchema<"this"> & { self: T };
export type iNever = ISchema<"never">;
export type iAny = ISchema<"any">;
export type iUnknown = ISchema<"unknown">;
export type iVoid = ISchema<"void">;
export type iUndefined = ISchema<"undefined">;
export type iNull = ISchema<"null">;
export type iBoolean = ISchema<"boolean">;
export type iNumber = ISchema<"number">;
export type iBigInt = ISchema<"bigint">;
export type iString = ISchema<"string">;
export type iSymbol = ISchema<"symbol">;
export type iLiteral<V = any> = ISchema<"literal"> & {
  value: V;
};
export type iArray<T extends iType = iType> = ISchema<"array"> & {
  item: T;
};
export type iObject<S extends Shape = Shape> = ISchema<"object"> & {
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
  extends ISchema<"class"> {
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
}
export type iUnion<T extends iType = iType> = ISchema<"union"> & {
  options: T[];
};
export type iEnum<T extends string[] = string[]> = ISchema<"enum"> & {
  options: T[];
  enum: {
    [Element in T[number]]: Element;
  };
};
export type iNativeEnum<T extends EnumLike = EnumLike> = ISchema<"enum"> & {
  options: (keyof T)[];
  enum: {
    [K in keyof T]: T[K];
  };
};
type EnumLike = {
  [key: string]: string | number;
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
  literal<const V>(value: V): iLiteral<V>;
  array<Item extends iType>(item: Item): iArray<Item>;
  object<S extends Shape>(shape: S): iObject<S>;
  class<S extends Shape>(shape: S): iClass<S>;
  union<T extends iType[]>(...options: T): iUnion<T[number]>;
  enum<T extends string[]>(...options: T): iEnum<T>;
  nativeEnum<T extends EnumLike>(options: T): iNativeEnum<T>;
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

export interface ISchema<K extends Kind> {
  kind: K;
  description: string | undefined;
  describe(description: string): this;
  optional<Self extends iType>(this: Self): iUnion<Self | iUndefined>;
  nullable<Self extends iType>(this: Self): iUnion<Self | iNull>;
  nullish<Self extends iType>(this: Self): iUnion<Self | iUndefined | iNull>;
  parse<Self extends new (...input: any[]) => any>(
    this: Self,
    value: any
  ): InstanceType<Self>;
  parse<Self extends iType>(this: Self, value: any): valueOf<Self, never>;
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

  public extend(shape: Shape) {
    if (this.kind === "class") {
      // @ts-ignore
      return itty.class({ ...this.shape, ...shape }, this);
    } else {
      // @ts-ignore
      return itty.object({ ...this.shape, ...shape });
    }
  }

  public merge(shape: iObject | iClass) {
    return this.extend(shape.shape);
  }

  public pick(mask: string[] | Record<string, true>, ...masks: string[]) {
    return this.pickOrOmit(
      typeof mask === "string" ? [mask, ...masks] : mask,
      true
    );
  }

  public omit(mask: string | Record<string, true>, ...masks: string[]) {
    return this.pickOrOmit(
      typeof mask === "string" ? [mask, ...masks] : mask,
      false
    );
  }

  public pickOrOmit(mask: string[] | Record<string, true>, isPick: boolean) {
    const keep = new Set(Array.isArray(mask) ? mask : Object.keys(mask));
    const shape = Object.fromEntries(
      // @ts-ignore
      Object.entries(this.shape).filter(([key]) =>
        isPick ? keep.has(key) : !keep.has(key)
      )
    );
    if (this.kind === "class") {
      // @ts-ignore
      return itty.class(shape);
    } else {
      // @ts-ignore
      return itty.object(shape);
    }
  }

  public partial() {
    const shape: any = {};
    for (const [key, value] of Object.entries((this as any).shape)) {
      shape[key] = itty.union(value as iType, itty.undefined());
    }
    if (this.kind === "class") {
      // @ts-ignore
      return itty.class(shape);
    } else {
      // @ts-ignore
      return itty.object(shape);
    }
  }

  public parse(value: any, self?: iType | undefined): any {
    const kind = this.kind;
    if (kind === "object" || kind === "class") {
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
            if (schema.options.some(itty.isUndefined)) {
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
    } else if (typeof value === kind) {
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
      if ((this as any as iLiteral).value !== value) {
        // TODO: support objects and array primitive values
        throw new Error("Expected a literal");
      }
      return value;
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
    } else if (kind === "union" || kind === "enum" || kind === "nativeEnum") {
      const s = this as any as iUnion | iEnum | iNativeEnum;
      for (const option of s.options) {
        if (kind === "enum" || kind === "nativeEnum") {
          if (option === value) {
            return value;
          }
        } else {
          try {
            // @ts-ignore
            return option.parse(value, self);
          } catch (error) {}
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
        } else if (kind === "coerce") {
          return () => createItty({ ...props, coerce: true });
        } else if (kind === "describe") {
          return (description: string) => createItty({ ...props, description });
        } else {
          return (...args: any[]) => {
            const opts: any = {
              ...props,
              kind,
              args,
            };
            if (kind === "union") {
              opts.options = args;
            } else if (kind === "enum") {
              opts.options = args;
              opts.enum = Object.fromEntries(
                args.map((option) => [option, option])
              );
            } else if (kind === "nativeEnum") {
              opts.options = Object.values(args[0]);
              opts.enum = args[0];
            } else if (kind === "literal") {
              opts.value = args[0];
            } else if (kind === "array") {
              opts.item = args[0];
            } else if (kind === "object" || kind === "class") {
              opts.shape = args[0];
            }
            const schema = new Schema(opts);
            if (kind !== "class") {
              return schema;
            } else {
              const superType = args[1];
              const _Schema =
                superType ??
                class _Schema {
                  constructor(value: any) {
                    Object.assign(this, value);
                  }
                };
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
            }
          };
        }
      },
    }
  ) as any;
}

export const itty = createItty({}) as Itty;

export default itty;
