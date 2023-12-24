import { type } from "arktype";

export const T = type({
  name: "string",
  age: "number",
});

export const T1 = type({
  t: T,
});

export const T2 = type({
  t1: T1,
});

export const T3 = type({
  t2: T2,
});

export const T4 = type({
  t3: T3,
});

export const T5 = type({
  t4: T4,
});

export function stressTest(
  t: T,
  t1: typeof T1.infer,
  t2: typeof T2.infer,
  t3: typeof T3.infer,
  t4: typeof T4.infer,
  t5: typeof T5.infer
): [
  typeof T.infer,
  typeof T1.infer,
  typeof T2.infer,
  typeof T3.infer,
  typeof T4.infer,
  typeof T5.infer
] {
  return [t, t1, t2, t3, t4, t5];
}

export type T = typeof T.infer;
