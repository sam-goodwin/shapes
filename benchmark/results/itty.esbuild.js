// node_modules/.pnpm/file+../node_modules/itty-schema/lib/index.js
var Schema = class {
  props;
  constructor(props) {
    if (typeof props === "string") {
      this.props = { kind: props };
    } else {
      this.props = props;
    }
    Object.assign(this, props);
  }
  clone(props) {
    return new this.constructor({
      ...this,
      ...props
    });
  }
  describe(description) {
    return this.clone({ description });
  }
  optional() {
    return itty.union(this, itty.undefined());
  }
  nullable() {
    return itty.union(this, itty.null());
  }
  nullish() {
    return itty.union(this, itty.null(), itty.undefined());
  }
  extend(shape) {
    if (this.kind === "class") {
      return itty.class({ ...this.shape, ...shape }, this);
    } else {
      return itty.object({ ...this.shape, ...shape });
    }
  }
  merge(shape) {
    return this.extend(shape.shape);
  }
  pick(mask, ...masks) {
    return this.pickOrOmit(typeof mask === "string" ? [mask, ...masks] : mask, true);
  }
  omit(mask, ...masks) {
    return this.pickOrOmit(typeof mask === "string" ? [mask, ...masks] : mask, false);
  }
  pickOrOmit(mask, isPick) {
    const keep = new Set(Array.isArray(mask) ? mask : Object.keys(mask));
    const shape = Object.fromEntries(
      // @ts-ignore
      Object.entries(this.shape).filter(([key]) => isPick ? keep.has(key) : !keep.has(key))
    );
    if (this.kind === "class") {
      return itty.class(shape);
    } else {
      return itty.object(shape);
    }
  }
  partial() {
    const shape = {};
    for (const [key, value] of Object.entries(this.shape)) {
      shape[key] = itty.union(value, itty.undefined());
    }
    if (this.kind === "class") {
      return itty.class(shape);
    } else {
      return itty.object(shape);
    }
  }
  deepPartial() {
    const self = this;
    if (this.kind === "class" || this.kind === "object") {
      const shape = {};
      for (const [key, value] of Object.entries(self.shape)) {
        shape[key] = itty.union(value, itty.undefined());
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
  keyof() {
    if (this.kind === "class" || this.kind === "object") {
      return itty.enum(...Object.keys(this.shape));
    }
  }
  parse(value, self) {
    const kind = this.kind;
    if (kind === "object" || kind === "class") {
      const obj = this;
      if (typeof value !== "object" || value === null) {
        throw new Error("Expected an object");
      }
      const result = {};
      for (const [key, schema] of Object.entries(obj.shape)) {
        if (key in value) {
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
      if (value !== void 0) {
        throw new Error("Expected void");
      }
      return value;
    } else if (kind === "bigint" && typeof value === "number") {
      return BigInt(value);
    } else if (kind === "literal") {
      if (this.value !== value) {
        throw new Error("Expected a literal");
      }
      return value;
    } else if (kind === "this") {
      if (self === void 0) {
        throw new Error(`this is undefined`);
      }
      return self.parse(value, self);
    } else if (kind === "array") {
      if (!Array.isArray(value)) {
        throw new Error("Expected an array");
      }
      return value.map((item) => (
        // @ts-ignore
        this.item.parse(item, self)
      ));
    } else if (kind === "union" || kind === "enum" || kind === "nativeEnum") {
      const s = this;
      for (const option of s.options) {
        if (kind === "enum" || kind === "nativeEnum") {
          if (option === value) {
            return value;
          }
        } else {
          try {
            return option.parse(value, self);
          } catch (error) {
          }
        }
      }
      throw new Error("Expected one of the union options");
    } else {
      throw new Error(`Unsupported type ${kind.toString()}`);
    }
  }
};
function createItty(props) {
  return new Proxy({}, {
    get: (_, kind) => {
      if (typeof kind === "string" && kind.startsWith("is")) {
        return (value) => value && (typeof value === "object" || typeof value === "function") && value.kind === kind.slice(2).toLowerCase();
      } else if (kind === "coerce") {
        return () => createItty({ ...props, coerce: true });
      } else if (kind === "describe") {
        return (description) => createItty({ ...props, description });
      } else {
        return (...args) => {
          const opts = {
            ...props,
            kind,
            args
          };
          if (kind === "union") {
            opts.options = args;
          } else if (kind === "enum") {
            opts.options = args;
            opts.enum = Object.fromEntries(args.map((option) => [option, option]));
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
            const _Schema = superType ?? class _Schema {
              constructor(value) {
                Object.assign(this, value);
              }
            };
            Object.assign(_Schema, schema);
            for (const prop of Object.getOwnPropertyNames(Schema.prototype)) {
              const value = schema[prop];
              if (typeof value === "function" && prop !== "constructor") {
                Object.defineProperty(_Schema, prop, {
                  value
                });
              }
            }
            return _Schema;
          }
        };
      }
    }
  });
}
var itty = createItty({});
var lib_default = itty;

// src/itty.ts
var Person = lib_default.object({
  name: lib_default.string(),
  age: lib_default.number()
});
var input = { name: "Alice", age: 30 };
var result1 = Person.parse(input);
console.log(result1);
