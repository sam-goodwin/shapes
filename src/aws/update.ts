import type { iArray, iUnion } from "../type.js";
import type { OneOf } from "../util.js";
import type { valueOf } from "../valueOf.js";
import { ConditionExpression, LeafConditionExpression } from "./condition.js";
import type { Entities } from "./entity.js";

export type UpdateRequest<E extends Entities> = {
  [alias in keyof E]: {
    [pk in E[alias]["traits"]["pk"][number]]: pk extends "$type"
      ? E[alias]["traits"]["fqn"]
      : valueOf<E[alias]>[Extract<pk, keyof valueOf<E[alias]>>];
  } & {
    [sk in E[alias]["traits"]["sk"][number]]: sk extends "$type"
      ? E[alias]["traits"]["fqn"]
      : valueOf<E[alias]>[Extract<sk, keyof valueOf<E[alias]>>];
  } & {
    [k in Exclude<
      keyof E[alias]["shape"],
      E[alias]["traits"]["pk"][number] | E[alias]["traits"]["sk"][number]
    >]?: UpdateExpression<E[alias]["shape"][k]>;
  };
}[keyof E];

type UpdateExpression<T> = T extends iUnion<infer U>
  ? UpdateExpression<U>
  : T extends iArray<infer U>
  ?
      | valueOf<T>
      | (OneOf<{
          $append: valueOf<U> | valueOf<T>[];
          $set: true;
          $unset: true;
        }> & {
          $if?: LeafConditionExpression<T>;
        })
  :
      | valueOf<T>
      | (OneOf<{
          $append: valueOf<T> | valueOf<T>[];
          $set: true;
          $unset: true;
        }> & {
          $if?: LeafConditionExpression<T>;
        });
