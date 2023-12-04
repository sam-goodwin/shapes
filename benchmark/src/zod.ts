import { z } from "zod";

const Person = z.object({
  name: z.string(),
  age: z.number(),
});

const input: unknown = { name: "Alice", age: 30 };

const result1 = Person.parse(input);

console.log(result1);
