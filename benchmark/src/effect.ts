import { struct, string, number, parse } from "@effect/schema/Schema";

const Person = struct({
  name: string,
  age: number,
});

const parsePerson = parse(Person);

const input: unknown = { name: "Alice", age: 30 };

const result1 = parsePerson(input);

console.log(result1);
