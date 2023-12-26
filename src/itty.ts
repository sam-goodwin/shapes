import type { Kind, Types, iType } from "./type.js";
import { Schema } from "./schema.js";

export const itty = createItty({}) as Itty;

export type Itty = Types & {
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

export function createItty<Props extends Record<string, any>>(
  props: Props
): Itty {
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
              opts.traits = args[1] ?? {};
            }
            const schema = new Schema(opts);
            if (kind === "class") {
              return createClass(schema, args[1], args[2]);
            }
            return schema;
          };
        }
      },
    }
  ) as any;
}

function createClass(schema: Schema<any, any>, traits?: any, superType?: any) {
  const _Schema =
    superType ??
    class _Schema {
      constructor(value: any) {
        Object.assign(this, value);
      }
    };
  // TODO: deep merge
  _Schema.traits = {
    ...(superType?.traits ?? {}),
    ...(traits ?? {}),
  };
  Object.assign(_Schema, schema);
  const prototype = Object.getPrototypeOf(schema);
  const properties = Object.getOwnPropertyNames(prototype);

  for (const prop of properties) {
    const value = (schema as any)[prop];
    const propDescriptor = Object.getOwnPropertyDescriptor(prototype, prop)!;
    if (propDescriptor.get || propDescriptor.set) {
      Object.defineProperty(_Schema, prop, propDescriptor);
    } else if (typeof value === "function" && prop !== "constructor") {
      Object.defineProperty(_Schema, prop, {
        value,
      });
    } else if (prop !== "length" && prop !== "prototype" && prop !== "name") {
      // @ts-ignore
      _Schema[prop] = value;
    }
  }
  return _Schema;
}
