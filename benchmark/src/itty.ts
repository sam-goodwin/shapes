import i from "itty-schema";

const Person = i.object({
  name: i.string(),
  age: i.number(),
});

const input: unknown = { name: "Alice", age: 30 };

const result1 = Person.parse(input);

console.log(result1);
