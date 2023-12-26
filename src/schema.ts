import { itty } from "./itty.js";
import { iTraits } from "./trait.js";
import type {
  Kind,
  iType,
  iUnion,
  iUndefined,
  iNull,
  Shape,
  iObject,
  iClass,
  iLiteral,
  iEnum,
  iNativeEnum,
} from "./type.js";
import type { marshalledValueOf, valueOf } from "./valueOf.js";

export interface SchemaOptions<K extends Kind, Traits extends iTraits> {
  kind: K;
  description?: string;
  traits?: Traits;
  [key: string]: any;
}

export interface Schema<K extends Kind, Traits extends iTraits> {
  kind: K;
  description: string | undefined;
}

export interface iSchema<K extends Kind> {
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
  parse<Self extends iSchema<any>>(this: Self, value: any): valueOf<Self>;
  parse<Self extends iType>(this: Self, value: any): valueOf<Self, never>;
  apply<Trait extends string, Data>(
    trait: Trait,
    data: Data
  ): this & {
    traits: {
      [trait in Trait]: Data;
    };
  };
  apply<Traits extends iTraits>(
    traits: Traits
  ): this & {
    traits: Traits;
  };
  marshall<Self extends new (...input: any[]) => any>(
    this: Self,
    value: InstanceType<Self>
  ): marshalledValueOf<Self>;
  marshall<Self extends iSchema<any>>(
    this: Self,
    value: valueOf<Self>
  ): marshalledValueOf<Self>;
  marshall<Self extends iType>(
    this: Self,
    value: valueOf<Self>
  ): marshalledValueOf<Self, never>;
}
export class Schema<K extends Kind, Traits extends iTraits> {
  readonly props: SchemaOptions<K, Traits>;

  constructor(props: SchemaOptions<K, Traits> | K) {
    if (typeof props === "string") {
      this.props = { kind: props };
    } else {
      this.props = props;
    }
    Object.assign(this, this.props);
  }

  public apply<Trait extends string, Data>(
    trait: Trait,
    data: Data
  ): this & {
    traits: {
      [trait in Trait]: Data;
    };
  };

  public apply<Traits extends iTraits>(
    traits: Traits
  ): this & {
    traits: Traits;
  };

  public apply(...args: [string, any] | [iTraits]) {
    // @ts-ignore
    const traits =
      typeof args[0] === "string" ? { [args[0]]: args[1] } : args[0];

    return this.clone({
      traits: {
        // @ts-ignore
        ...this.traits,
        ...traits,
      },
    });
  }

  private clone(props: any): this {
    if (this.kind === "class") {
      // @ts-ignore
      const New = cloneClass(this);
      // @ts-ignore
      New.props = {
        ...this.props,
        ...props,
      };
      // @ts-ignore
      New.traits = New.props.traits;
      // @ts-ignore
      return New;
    } else {
      const New = new (this.constructor as any)({
        ...this,
        ...props,
      });
      return New;
    }
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
      return itty.class({ ...this.shape, ...shape }, undefined, this);
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

  public deepPartial() {
    const self = this as any;
    if (this.kind === "class" || this.kind === "object") {
      const shape: any = {};
      for (const [key, value] of Object.entries(self.shape)) {
        shape[key] = itty.union(value as iType, itty.undefined());
      }
      if (this.kind === "class") {
        return itty.class(shape);
      } else {
        return itty.object(shape);
      }
    } else if (this.kind === "array") {
      return itty.array(self.item.deepPartial());
    } else {
      return itty.union(self, itty.undefined());
    }
  }

  public keyof() {
    if (this.kind === "class" || this.kind === "object") {
      // @ts-ignore
      return itty.enum(...Object.keys(this.shape));
    }
  }

  public marshall(value: any, self?: iType | undefined): any {
    // TODO: marshalling logic should be different than parse since it can only create json-compatible values
    return this.parse(value);
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

function cloneClass<T>(
  original: new (...args: any[]) => T
): new (...args: any[]) => T {
  // Create a new class with the same constructor as the original
  const cloned = function (...args: any[]) {
    return new original(...args);
  } as any;

  // Copy static properties and methods
  Object.assign(cloned, original);

  // Copy prototype properties and methods
  cloned.prototype = Object.create(original.prototype);

  for (const prop of Object.getOwnPropertyNames(original)) {
    const value = (original as any)[prop];
    const propDescriptor = Object.getOwnPropertyDescriptor(original, prop)!;

    if (propDescriptor.get || propDescriptor.set) {
      Object.defineProperty(cloned, prop, propDescriptor);
    } else if (typeof value === "function") {
      if (prop !== "constructor") {
        Object.defineProperty(cloned, prop, {
          value,
        });
      }
    } else if (prop !== "length" && prop !== "prototype" && prop !== "name") {
      cloned[prop] = value;
    }
  }

  return cloned;
}
