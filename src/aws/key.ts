import type { Simplify } from "../util.js";
import type { valueOfShape, valueOf } from "../valueOf.js";
import type { Entity, Entities } from "./entity.js";

export type Key<
  FQN extends string = string,
  Data extends Record<string, any> = any
> = {
  $type: FQN;
} & Data;

export function isKey(a: any): a is Key {
  return a && typeof a === "object" && "$type" in a;
}

export type KeyOfEntity<E extends Entity> = Simplify<
  {
    $type: E["traits"]["fqn"];
  } & (E["traits"]["sk"] extends undefined ? PK<E> : PK<E> & SK<E>)
>;

export type ShortKeyOfEntity<E extends Entity> = Simplify<
  {
    [pk in E["traits"]["pk"][number]]: valueOfShape<E["shape"], any>[Extract<
      pk,
      keyof valueOfShape<E["shape"], any>
    >];
  } & {
    [sk in E["traits"]["sk"][number]]: valueOfShape<E["shape"], any>[Extract<
      sk,
      keyof valueOfShape<E["shape"], any>
    >];
  }
>;

export type KeysOfEntities<E extends Entities> = {
  [K in keyof E]: KeyOfEntity<E[K]>;
}[keyof E];

export type PK<E extends Entity> = {
  [pk in keyof Pick<
    valueOf<E>,
    Extract<E["traits"]["pk"][number], keyof valueOf<E>>
  >]: valueOf<E>[Extract<pk, keyof valueOf<E>>];
};

export type SK<E extends Entity> = {
  [sk in keyof Pick<
    valueOf<E>,
    Extract<
      Extract<E["traits"]["sk"], readonly string[]>[number],
      keyof valueOf<E>
    >
  >]: valueOf<E>[Extract<sk, keyof valueOf<E>>];
};
