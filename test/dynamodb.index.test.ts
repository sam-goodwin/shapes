import i from "../src/index.js";
import { entity, table } from "../src/aws/dynamodb.js";
import { beforeAll, expect, test } from "bun:test";
import { documentClient, prepareTable } from "./dynamodb-client.js";

export class Thread extends entity("Thread", {
  pk: ["$type", "threadUlid"],
  attributes: {
    threadUlid: i.string(),
    userId: i.string(),
    title: i.string().optional(),
    createTime: i.string(),
    updateTime: i.string(),
  },
  indexes: {
    byUser: {
      pk: ["userId"],
      sk: ["threadUlid"],
    },
    byUserSortedByUpdateTime: {
      pk: ["userId"],
      sk: ["updateTime"],
    },
  },
}) {}

export class Message extends entity("Message", {
  pk: ["$type", "threadUlid"],
  sk: ["messageUlid"],
  attributes: {
    threadUlid: i.string(),
    messageUlid: i.string(),
    userId: i.string(),
    message: i.string(),
    createTime: i.string(),
    updateTime: i.string().optional(),
  },
}) {}

export class ThreadTable extends table({
  entities: {
    Thread,
    Message,
  },
}) {}

const threads = new ThreadTable({
  tableName: "dynamodb_index_test",
  client: documentClient,
});

beforeAll(async () => {
  // @ts-ignore
  await prepareTable(threads);
});

test("create thread with messages", async () => {
  //
  const thread = new Thread({
    threadUlid: "thread-ulid",
    userId: "user-id",
    title: "title",
    createTime: "2021-01-01T00:00:00.000Z",
    updateTime: "2021-01-01T00:00:00.000Z",
  });
  const msg1 = new Message({
    threadUlid: "thread-ulid",
    messageUlid: "message-ulid-1",
    userId: "user-id",
    message: "message",
    createTime: "2021-01-01T00:00:00.000Z",
  });
  const msg2 = new Message({
    threadUlid: "thread-ulid",
    messageUlid: "message-ulid-2",
    userId: "user-id",
    message: "message",
    createTime: "2021-01-01T00:00:00.000Z",
  });
  await threads.put(thread, msg1, msg2);

  // expect(
  //   (
  //     await threads.Thread.byUser({
  //       userId: "user-id",
  //       threadUlid: {
  //         $beginsWith: "thread-ulid",
  //       },
  //     })
  //   ).items
  // ).toEqual([thread]);
});
