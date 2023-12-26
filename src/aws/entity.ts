import { itty } from "../itty.js";
import type { iSchema } from "../schema.js";
import type { Shape, iClass } from "../type.js";
import type { Simplify } from "../util.js";
import type { valueOf, valueOfShape } from "../valueOf.js";
import type { ShortKeyOfEntity } from "./key.js";

export type Entities<E extends Entity = Entity> = Record<string, E>;

export type Entity<
  FQN extends string = string,
  S extends Shape = Shape,
  PK extends readonly AllowedPrimaryKeys<S>[] = readonly AllowedPrimaryKeys<S>[],
  SK extends readonly AllowedPrimaryKeys<S>[] = readonly AllowedPrimaryKeys<S>[]
> = iSchema<"class"> & {
  shape: S;
  traits: {
    fqn: FQN;
    pk: PK;
    sk: SK;
  };
};

export function entity<
  FQN extends string,
  S extends Shape,
  const PK extends readonly AllowedPrimaryKeys<S>[],
  const SK extends readonly AllowedPrimaryKeys<S>[] = []
>(
  fqn: FQN,
  options: {
    attributes: S;
    pk: PK;
    sk?: SK;
  }
): iClass<
  S,
  {
    $type: FQN;
  }
> & {
  traits: {
    pk: PK;
    sk: SK;
    fqn: FQN;
  };
  Key: {
    $infer: Simplify<
      {
        [pk in PK[number]]: pk extends "$type"
          ? FQN
          : valueOfShape<S, any>[Extract<pk, keyof valueOfShape<S, any>>];
      } & {
        [sk in SK[number]]: sk extends "$type"
          ? FQN
          : valueOfShape<S, any>[Extract<sk, keyof valueOfShape<S, any>>];
      }
    >;
    <
      Self extends Entity<FQN, S, PK, SK>,
      const K extends ShortKeyOfEntity<Self>
    >(
      this: Self,
      key: K
    ): Simplify<K>;
  };
} {
  // @ts-expect-error - types are cray
  return class extends itty.class<any>(options.attributes, {
    pk: options.pk,
    sk: options.sk!,
    fqn,
  }) {
    static Key<
      Self extends Entity<FQN, S, PK, SK>,
      K extends ShortKeyOfEntity<Self>
    >(this: Self, key: K) {
      return {
        $type: fqn,
        ...key,
      };
    }
    $type = fqn;
  };
}

type AllowedPrimaryKeys<S> =
  | "$type"
  | keyof Pick<
      S,
      Extract<
        {
          [K in keyof S]: valueOf<S[K]> extends string | number | undefined
            ? K
            : never;
        }[keyof S],
        string
      >
    >;
