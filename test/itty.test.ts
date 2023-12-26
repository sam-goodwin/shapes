import { test, expect } from "bun:test";

import i from "../src/index.js";
import { valueOf } from "../src/valueOf.js";

test("object", () => {
  const User = i.object({
    username: i.string(),
    self: i.array(i.this()),
  });

  type User = valueOf<typeof User>;

  expect(i.isObject(User)).toBe(true);

  const user = User.parse({
    username: "john",
    self: [
      {
        username: "foo",
        self: [],
      },
    ],
  });

  expect(user).toEqual({
    username: "john",
    self: [
      {
        username: "foo",
        self: [],
      },
    ],
  });
});

test("object extends", () => {
  const User = i.object({
    username: i.string(),
    self: i.this().optional(),
  });

  const Person = User.extend({
    username: i.literal("person"),
    age: i.number(),
  });

  type Person = valueOf<typeof Person>;

  expect(i.isObject(Person)).toBe(true);

  const person = Person.parse({
    username: "person",
    age: 42,
  });

  expect(person).toEqual({
    username: "person",
    age: 42,
  });

  expect(() =>
    Person.parse({
      username: "sam",
      age: "42",
    })
  ).toThrow();
});

test("object merge", () => {
  const User = i.object({
    username: i.string(),
    self: i.this().optional(),
  });

  const e = i.object({
    username: i.literal("person"),
    age: i.number(),
  });
  const Person = User.merge(e);

  type Person = valueOf<typeof Person>;

  expect(i.isObject(Person)).toBe(true);

  const person = Person.parse({
    username: "person",
    age: 42,
  });

  expect(person).toEqual({
    username: "person",
    age: 42,
  });

  expect(() =>
    Person.parse({
      username: "sam",
      age: "42",
    })
  ).toThrow();
});

test("object pick", () => {
  const User = i.object({
    username: i.string(),
    self: i.this().optional(),
  });

  const Person = User.pick("username");

  type Person = valueOf<typeof Person>;

  expect(i.isObject(Person)).toBe(true);

  const person = Person.parse({
    username: "person",
  });

  expect(person).toEqual({
    username: "person",
  });
});

test("object omit", () => {
  const User = i.object({
    username: i.string(),
    age: i.number(),
  });

  const Person = User.omit("age");

  type Person = valueOf<typeof Person>;

  expect(i.isObject(Person)).toBe(true);

  const person = Person.parse({
    username: "person",
  });

  expect(person).toEqual({
    username: "person",
  });
});

test("object partial", () => {
  const User = i.object({
    username: i.string(),
    age: i.number(),
  });
  const PartialUser = User.partial();

  expect(i.isObject(User)).toBe(true);

  const person = PartialUser.parse({
    username: "person",
  });

  expect(person).toEqual({
    username: "person",
  });
});

// test("object deepPartial", () => {
//   const User = i.object({
//     username: i.string(),
//     age: i.number(),
//     metadata: i.object({
//       foo: i.string(),
//     }),
//     list: i.array(i.object({ foo: i.string() })),
//   });
//   const PartialUser = User.deepPartial();

//   expect(i.isObject(User)).toBe(true);

//   const person = PartialUser.parse({
//     username: "person",
//   });

//   expect(person).toEqual({
//     username: "person",
//   });
// });

test("class", () => {
  class User extends i.class({
    username: i.string(),
    user: i.this<User>().optional(),
    users: i.array(i.this<User>()),
  }) {
    getUsername() {
      return this.username;
    }
  }

  expect(i.isClass(User)).toBe(true);

  const user = User.parse({
    username: "john",
    user: {
      username: "bart",
      users: [],
    },
    users: [
      {
        username: "sam",
        users: [],
      },
    ],
  });
  expect(user).toBeInstanceOf(User);
  expect(user.getUsername()).toBe("john");
  expect(user.user!.getUsername()).toBe("bart");
  expect(user.users[0].getUsername()).toBe("sam");

  expect(user).toEqual(
    new User({
      username: "john",
      user: new User({
        username: "bart",
        users: [],
      }),
      users: [
        new User({
          username: "sam",
          users: [],
        }),
      ],
    })
  );
});

test("class extends", () => {
  class User extends i.class({
    username: i.string(),
    self: i.this().optional(),
  }) {
    getUser() {
      return this.self;
    }
  }

  class Person extends User.extend({
    username: i.literal("person"),
    age: i.number(),
  }) {}

  expect(i.isClass(Person)).toBe(true);

  const person = Person.parse({
    username: "person",
    age: 42,
  });
  expect(person).toBeInstanceOf(User);
  expect(person).toBeInstanceOf(Person);

  expect(person).toEqual({
    username: "person",
    age: 42,
  });

  expect(() =>
    Person.parse({
      username: "sam",
      age: "42",
    })
  ).toThrow();
});

test("class pick", () => {
  class User extends i.class({
    username: i.string(),
    self: i.this().optional(),
  }) {}

  class Person extends User.pick("username") {
    getPerson() {
      return this.username;
    }
  }

  expect(i.isClass(Person)).toBe(true);

  const person = Person.parse({
    username: "person",
  });

  expect(person).toEqual(
    new Person({
      username: "person",
    })
  );
});

test("class omit", () => {
  class User extends i.class({
    username: i.string(),
    age: i.number(),
  }) {}

  class Person extends User.omit("age") {
    getPerson() {
      return this.username;
    }
  }

  expect(i.isClass(Person)).toBe(true);

  const person = Person.parse({
    username: "person",
  });

  expect(person).toEqual(
    new Person({
      username: "person",
    })
  );
});

test("class partial", () => {
  class User extends i.class({
    username: i.string(),
    age: i.number(),
  }) {}
  class PartialUser extends User.partial() {}

  expect(i.isClass(User)).toBe(true);

  const person = PartialUser.parse({
    username: "person",
  });

  expect(person).toEqual(
    new PartialUser({
      username: "person",
    })
  );
});

test("enum", () => {
  const Fruit = i.enum("apple", "banana", "orange");

  const a: "apple" | "banana" | "orange" = Fruit.parse("apple");
  expect(a).toBe("apple");
  expect(Fruit.parse("banana")).toBe("banana");
  expect(Fruit.parse("orange")).toBe("orange");
  let b: "mandarin" | undefined;
  try {
    // @ts-expect-error
    b = Fruit.parse("mandarin");
  } catch {}
  if (b) {
    throw new Error("mandarin should not parse");
  }
});

test("nativeEnum", () => {
  enum Fruit {
    Apple = "apple",
    Banana = "banana",
    Orange = "orange",
    Water = 1,
  }

  const FruitS = i.nativeEnum(Fruit);

  const a: Fruit = FruitS.parse("apple");
  expect(a).toBe(Fruit.Apple);
  expect(FruitS.parse("banana")).toBe(Fruit.Banana);
  expect(FruitS.parse("orange")).toBe(Fruit.Orange);
  expect(FruitS.parse(1)).toBe(Fruit.Water);
  let b: "mandarin" | undefined;
  try {
    // @ts-expect-error
    b = FruitS.parse("mandarin");
  } catch {}
  if (b) {
    throw new Error("mandarin should not parse");
  }
});

test("nativeEnum noInitializer", () => {
  enum Fruit {
    Apple = 2,
    Banana,
    Orange,
    Water,
  }

  const FruitS = i.nativeEnum(Fruit);

  const a: Fruit = FruitS.parse(2);
  expect(a).toBe(Fruit.Apple);
  expect(FruitS.parse(3)).toBe(Fruit.Banana);
  expect(FruitS.parse(4)).toBe(Fruit.Orange);
  expect(FruitS.parse(5)).toBe(Fruit.Water);
  let b: "mandarin" | undefined;
  try {
    // @ts-expect-error
    b = FruitS.parse("mandarin");
  } catch {}
  if (b) {
    throw new Error("mandarin should not parse");
  }
});

test("nativeEnum const", () => {
  const Fruit = {
    Apple: "apple",
    Banana: "banana",
    Orange: "orange",
    Water: 1,
  };

  const FruitS = i.nativeEnum(Fruit);

  const a: (typeof Fruit)[keyof typeof Fruit] = FruitS.parse("apple");
  expect(a).toBe(Fruit.Apple);
  expect(FruitS.parse("banana")).toBe(Fruit.Banana);
  expect(FruitS.parse("orange")).toBe(Fruit.Orange);
  expect(FruitS.parse(1)).toBe(Fruit.Water);
  let b: "mandarin" | undefined;
  try {
    // @ts-expect-error
    b = FruitS.parse("mandarin");
  } catch {}
  if (b) {
    throw new Error("mandarin should not parse");
  }
});

test("describe", () => {
  expect(i.describe("foo").string().description).toBe("foo");
  expect(i.string().describe("foo").description).toBe("foo");
  expect(i.object({}).describe("foo").description).toBe("foo");
  expect(
    i.object({
      foo: i.string(),
    }).shape.foo.description
  ).toBe(undefined!);
  expect(
    i.describe("bar").object({
      foo: i.string().describe("foo"),
    }).shape.foo.description
  ).toBe("foo");
  expect(
    i.object({
      foo: i.string().describe("foo"),
    }).shape.foo.description
  ).toBe("foo");
  expect(i.describe("foo").object({}).description).toBe("foo");
});

test("keyof", () => {
  const User = i.object({
    username: i.string(),
    age: i.number(),
  });

  const UserKeys = User.keyof();
  expect(UserKeys.parse("username")).toBe("username");
  expect(UserKeys.parse("age")).toBe("age");
});

test("trait", () => {
  //
  class Foo extends i
    .class({
      fooId: i.string().apply("dynamo:isPK", true),
    })
    .apply({
      isTable: true,
    }) {}
  expect(Foo.traits.isTable).toBe(true);
  expect(Foo.shape.fooId.traits).toEqual({ "dynamo:isPK": true });
  const foo = Foo.parse({ fooId: "foo" });
  expect(foo).toEqual(new Foo({ fooId: "foo" }));
  expect(foo.fooId).toBe("foo");
});
