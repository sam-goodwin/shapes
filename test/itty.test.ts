import i, { valueOf } from "../src/index.js";

import { test, expect } from "bun:test";

test("object", () => {
  const User = i.object({
    username: i.string(),
    self: i.array(i.this()),
  });

  type User = valueOf<typeof User>;

  expect(i.isObject(User)).toBe(true);

  const user = User.parse({
    username: "john",
    self: [],
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

test("class", () => {
  class User extends i.class({
    username: i.string(),
    self: i.array(i.this<User>()),
  }) {
    getUsername() {
      return this.username;
    }
  }

  const user2 = new User({
    username: "john",
    self: [
      new User({
        username: "",
        self: [],
      }),
    ],
  });
  expect(i.isClass(User)).toBe(true);

  const user = User.parse({
    username: "john",
    self: [],
  });
  expect(user).toBeInstanceOf(User);
  expect(user.getUsername()).toBe("john");

  expect(user).toEqual(
    new User({
      username: "john",
      self: [],
    })
  );
});
