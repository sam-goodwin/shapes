import { Type } from "@sinclair/typebox";

export const T = Type.Object({
  name: Type.String(),
  age: Type.Number(),
});
