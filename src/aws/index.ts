import type { Shape } from "../type.js";
import type { NonEmptyArray } from "../util.js";
import type { valueOf } from "../valueOf.js";
import type { AllowedPrimaryKeys, Entities, Entity } from "./entity.js";
import { SortKeyExpression } from "./query.js";

export type IndexOnShape<S extends Shape> = Readonly<{
  readonly pk: Readonly<NonEmptyArray<AllowedPrimaryKeys<S>>>;
  readonly sk: Readonly<AllowedPrimaryKeys<S>[]>;
}>;

export type IndexesOnShape<S extends Shape> = {
  [name: string]: IndexOnShape<S>;
};

export type Index<E extends Entities> = {
  [name in keyof E]: IndexOnShape<E[name]["shape"]>;
}[keyof E];

export type Indexes<E extends Entities> = {
  [name: string]: Index<E>;
};

export type IndexQueryExpression<
  I extends IndexOnShape<E["shape"]>,
  E extends Entity
> = {
  [pk in I["pk"][number]]: valueOf<E["shape"][pk]>;
} & SortKeyExpression<E, I["sk"]>;
