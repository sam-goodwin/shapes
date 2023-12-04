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
