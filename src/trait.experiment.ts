import type { Kind } from "./type.js";

declare module "./schema.js" {
  interface iSchema<K extends Kind>
    extends Traits<{
      min: [length: number];
      max: [length: number];
    }> {}
}

type Traits<T extends Record<string, any[]>> = {
  [k in keyof T]: Trait<k, T[k]>;
};

type Trait<Name extends string | number | symbol, Args extends any[]> = <Self>(
  this: Self,
  ...args: Args
) => Self & {
  traits: {
    [name in Name]: Args extends []
      ? undefined
      : Args extends [infer A1]
      ? A1
      : Args;
  };
};
