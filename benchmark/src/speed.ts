import itty from "itty-schema";
import { z } from "zod";
import { Type } from "@sinclair/typebox";
import * as S from "@effect/schema/Schema";
import yup from "yup";

bench();
bench();

function bench() {
  test("itty-schema", () => {
    const Person = itty.object({
      name: itty.string(),
      age: itty.number(),
    });
  });

  test("zod", () => {
    const Person = z.object({
      name: z.string(),
      age: z.number(),
    });
  });

  test("effect", () => {
    const Person = S.struct({
      name: S.string,
      age: S.number,
    });
  });

  test("typebox", () => {
    const T = Type.Object({
      name: Type.String(),
      age: Type.Number(),
    });
  });

  test("yup", () => {
    const T = yup.object({
      name: yup.string(),
      age: yup.number(),
    });
  });
}

function test(name: string, fn: () => void) {
  console.time(name);
  for (let i = 0; i < 1_000_000; i++) {
    fn();
  }
  console.timeEnd(name);
}
