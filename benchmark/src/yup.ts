import { object, string, number } from "yup";

export const T = object({
  name: string(),
  age: number(),
});
