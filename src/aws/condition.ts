import { iSchema } from "../schema.js";
import {
  iArray,
  iBoolean,
  iNull,
  iNumber,
  iObject,
  iString,
  iType,
  iUnion,
} from "../type.js";
import type { OneOf } from "../util.js";
import type { valueOf } from "../valueOf.js";
import type { Entities } from "./entity.js";

export type ConditionExpression<E extends Entities> =
  | {
      $exists: boolean;
    }
  | {
      $contains: OneOf<{
        [path in Paths<E>]: any;
      }>;
    }
  | OneOf<{
      $and: ConditionExpression<E> | (ConditionExpression<E> | undefined)[];
      $or: ConditionExpression<E> | (ConditionExpression<E> | undefined)[];
      $not: ConditionExpression<E>;
    }>
  | {
      [alias in keyof E]: {
        [k in Exclude<
          keyof E[alias]["shape"],
          E[alias]["traits"]["pk"][number] | E[alias]["traits"]["sk"][number]
        >]?: LeafConditionExpression<E[alias]["shape"][k]>;
      };
    }[keyof E];

type Paths<E extends Entities> = {
  [alias in keyof E]: {
    [k in keyof E[alias]["shape"]]: k;
  }[keyof E[alias]["shape"]];
}[keyof E];

export type LeafConditionExpression<T> = T extends iArray<infer U>
  ?
      | valueOf<T>
      | {
          $exists: boolean;
        }
      | {
          [i in number]?: LeafConditionExpression<U>;
        }
  : T extends iObject<infer S>
  ?
      | valueOf<T>
      | {
          $exists: boolean;
        }
      | ComparatorExpression<T>
      | {
          [k in keyof S]?: LeafConditionExpression<S[k]>;
        }
  : T extends iUnion<infer U>
  ? LeafConditionExpression<U>
  : T extends iString | iNumber | iBoolean | iNull
  ?
      | valueOf<T>
      | ComparatorExpression<T>
      | {
          $exists: boolean;
        }
  : never;

type ComparatorExpression<T extends iType> =
  | {
      $eq: valueOf<T>;
    }
  | {
      $ne: valueOf<T>;
    }
  | {
      $in: valueOf<T>[];
    }
  | {
      $beginsWith: valueOf<T>;
    }
  | {
      $between: [valueOf<T>, valueOf<T>];
    };

export function isComparator(a: any): a is Comparator<any> {
  return (
    a &&
    typeof a === "object" &&
    ("$gte" in a ||
      "$gt" in a ||
      "$lt" in a ||
      "$lte" in a ||
      "$beginsWith" in a ||
      "$between" in a)
  );
}

export type Comparator<V> =
  | Comparator.GTE<V>
  | Comparator.GT<V>
  | Comparator.LT<V>
  | Comparator.LTE<V>
  | Comparator.BeginsWith<V>
  | Comparator.Between<V>;

export declare namespace Comparator {
  export type GTE<V> = {
    $gte: V;
  };

  export type GT<V> = {
    $gt: V;
  };

  export type LT<V> = {
    $lt: V;
  };

  export type LTE<V> = {
    $lte: V;
  };

  export type BeginsWith<V> = {
    $beginsWith: V;
  };

  export type Between<V> = {
    $between: [V, V];
  };
}

export function isGTE(a: any): a is Comparator.GTE<string | number> {
  return a && typeof a === "object" && "$gte" in a;
}

export function isGT(a: any): a is Comparator.GT<string | number> {
  return a && typeof a === "object" && "$gt" in a;
}

export function isLT(a: any): a is Comparator.LT<string | number> {
  return a && typeof a === "object" && "$lt" in a;
}

export function isLTE(a: any): a is Comparator.LTE<string | number> {
  return a && typeof a === "object" && "$lte" in a;
}

export function isBeginsWith(
  a: any
): a is Comparator.BeginsWith<string | number> {
  return a && typeof a === "object" && "$beginsWith" in a;
}

export function isBetween(a: any): a is Comparator.Between<string | number> {
  return a && typeof a === "object" && "$between" in a;
}
