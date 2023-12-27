import { test, beforeAll, expect } from "bun:test";

import i from "../src/index.js";
import {
  LastEvaluatedKey as _LastEvaluatedKey,
  entity,
  table,
} from "../src/aws/dynamodb.js";
import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBClient,
  CreateTableCommand,
  ConditionalCheckFailedException,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  endpoint: "http://0.0.0.0:4566",
});
const documentClient = DynamoDBDocumentClient.from(client);

beforeAll(async () => {
  try {
    await client.send(
      new CreateTableCommand({
        TableName: "test_table",
        KeySchema: [
          { AttributeName: "$pk", KeyType: "HASH" },
          { AttributeName: "$sk", KeyType: "RANGE" },
        ],
        AttributeDefinitions: [
          { AttributeName: "$pk", AttributeType: "S" },
          { AttributeName: "$sk", AttributeType: "S" },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      })
    );
  } catch (err: any) {
    console.log("Table already exists");
  }

  let params = {
    TableName: "test_table",
    ConsistentRead: true,
  };
  while (true) {
    const scan = await documentClient.send(new ScanCommand(params));
    if (scan.Items === undefined || scan.Items.length === 0) {
      break;
    }
    const deleteRequests = scan.Items?.map((item) => ({
      DeleteRequest: {
        Key: {
          $pk: item["$pk"],
          $sk: item["$sk"],
        },
      },
    }));
    const batchParams = {
      RequestItems: {
        test_table: deleteRequests,
      },
    };
    await documentClient.send(new BatchWriteCommand(batchParams));
  }
});

class User extends entity("User", {
  pk: ["userId"],
  sk: ["name", "value", "$type"],
  attributes: {
    userId: i.string(),
    name: i.string(),
    value: i.string(),
    dangling: i.string().optional(),
    arr: i.array(i.string()),
    optionalList: i.array(i.string()).optional(),
    struct: i.object({
      a: i.string(),
      b: i.string(),
      list: i.array(i.string()),
    }),
  },
}) {
  getUsername() {
    return this.$type;
  }
}

class Chat extends entity("Chat", {
  pk: ["chatId"],
  sk: ["$type"],
  attributes: {
    chatId: i.string(),
    userId: i.string(),
  },
}) {}

class Message extends entity("Message", {
  pk: ["chatId"],
  sk: ["messageId", "$type"],
  attributes: {
    chatId: i.string(),
    messageId: i.string(),
    userId: i.string(),
    message: i.string(),
  },
}) {
  getMessage() {
    return this.message;
  }
}

declare namespace ChatTable {
  export type LastEvaluatedKey<Q extends ChatTable.Query> = ReturnType<
    typeof ChatTable.LastEvaluatedKey<Q>
  >;
  export type Query = typeof ChatTable.Query;
  export type QueryItem<Q extends Query> = ReturnType<
    typeof ChatTable.QueryItem<Q>
  >;
}

class ChatTable extends table({
  user: User,
  chat: Chat,
  message: Message,
}) {}

const chatTable = new ChatTable({
  tableName: "test_table",
  client: documentClient,
});

test("put, get & query Message", async () => {
  const message = new Message({
    chatId: "chat-id",
    messageId: "message-id",
    userId: "user-id",
    message: "message",
  });

  await chatTable.put(message);

  const result = await chatTable.get(message);
  expect(result.item).toEqual(message);

  const { items } = await chatTable.query({
    chatId: "chat-id",
    messageId: {
      $beginsWith: "message-id",
    },
  });
  expect(items).toEqual([message]);
});

test("batch put/get & query.iter", async () => {
  const message1 = new Message({
    chatId: "chat-id",
    messageId: "message-id-1",
    userId: "user-id",
    message: "message",
  });
  const message2 = new Message({
    chatId: "chat-id",
    messageId: "message-id-2",
    userId: "user-id",
    message: "message",
  });

  await chatTable.put(message1, message2);

  const result = await chatTable.get(message1, message2);
  expect(result.items).toEqual([message1, message2]);

  const items = [];
  for await (const item of chatTable.query.iter({
    chatId: "chat-id",
    messageId: {
      $beginsWith: "message-id-",
    },
  })) {
    items.push(item);
  }
  expect(items).toEqual([message1, message2]);
});

test("delete", async () => {
  const message = new Message({
    chatId: "delete-chat-id",
    messageId: "delete-message-id",
    userId: "user-id",
    message: "message",
  });

  await chatTable.put(message);

  const result = await chatTable.get(message);
  expect(result.item).toEqual(message);

  await chatTable.delete(message);

  const result2 = await chatTable.get(message);
  expect(result2.item).toBeUndefined();
});

test("deleteBatch", async () => {
  const message1 = new Message({
    chatId: "batch-delete-chat-id-1",
    messageId: "batch-delete-message-id-1",
    userId: "user-id",
    message: "message",
  });

  const message2 = new Message({
    chatId: "batch-delete-chat-id-1",
    messageId: "batch-delete-message-id-2",
    userId: "user-id",
    message: "message",
  });

  await chatTable.put(message1, message2);

  const result = await chatTable.get(message1, message2);
  expect(result.items).toEqual([message1, message2]);

  await chatTable.delete(message1, message2);

  const result2 = await chatTable.get(message1, message2);
  expect(result2.items).toEqual([undefined, undefined]);

  const result3 = await chatTable.query({ chatId: "batch-delete-chat-id-1" });
  expect(result3.items).toEqual([]);
});

test("update", async () => {
  const user = new User({
    userId: "user-id",
    name: "sam",
    value: "value",
    dangling: "dangling",
    arr: ["value"],
    optionalList: ["value"],
    struct: {
      a: "a",
      b: "b",
      list: ["value"],
    },
  });

  await chatTable.put(user);

  const user2 = await chatTable.get(user);

  expect(user2.item).toEqual(user);

  await chatTable.update({
    $type: "User",
    name: "sam",
    userId: "user-id",
    value: "value",
    dangling: undefined,
    arr: {
      $append: "value2",
    },
    optionalList: ["value"],
  });

  const user3 = await chatTable.get(user);

  expect(user3.item).toEqual(
    new User({
      ...user,
      dangling: undefined,
      arr: ["value", "value2"],
    })
  );

  try {
    await chatTable.update(
      {
        $type: "User",
        name: "sam",
        userId: "user-id",
        value: "value",
        dangling: undefined,
      },
      {
        where: {
          dangling: "dangling",
        },
      }
    );
    throw new Error("Expected error");
  } catch (error) {
    expect(error).toBeInstanceOf(ConditionalCheckFailedException);
  }
});

// type-only tests
async function foo() {
  const k = Chat.Key({
    $type: "Chat",
    chatId: "chat",
  });
  async function _() {
    const { item: chat1 } = (await chatTable.get(k)) satisfies {
      item: Chat | undefined;
    };

    const { item: chat2 } = (await chatTable.get({
      $type: "Chat",
      chatId: "chatID",
    })) satisfies {
      item: Chat | undefined;
    };

    const chat2_1 = (await chatTable.get(
      {
        $type: "Chat",
        chatId: "chatID",
      },
      {
        $type: "Chat",
        chatId: "chatID",
      }
    )) satisfies {
      items: readonly [Chat | undefined, Chat | undefined];
    };

    const {
      items: [chat3, chat4, message_2],
    } = (await chatTable.get(
      {
        $type: "Chat",
        chatId: "chat1",
      },
      {
        $type: "Chat",
        chatId: "chat3",
      },
      {
        chatId: "chat3",
        $type: "Message",
        messageId: "message",
      }
    )) satisfies {
      items: readonly [Chat | undefined, Chat | undefined, Message | undefined];
    };

    const {
      items: [chat3_1, chat4_1, message_1],
    } = (await chatTable.get([
      {
        $type: "Chat",
        chatId: "chat1",
      },
      {
        $type: "Chat",
        chatId: "chat3",
      },
      {
        chatId: "chat3",
        messageId: "message",
        $type: "Message",
      },
    ])) satisfies {
      items: readonly [Chat | undefined, Chat | undefined, Message | undefined];
    };

    const { items: users, lastEvaluatedKey } = (await chatTable.query({
      userId: "user",
      name: "sam",
      value: {
        $beginsWith: "1",
      },
    })) satisfies {
      items: User[];
      lastEvaluatedKey: typeof User.Key.$infer | undefined;
    };

    const { items: users3 } = await chatTable.query({
      userId: "123",
      name: "",
    });

    const a = (await chatTable.query({
      chatId: "chat-id",
      messageId: {
        $beginsWith: "msg-",
      },
    })) satisfies {
      lastEvaluatedKey:
        | {
            readonly chatId: "chat-id";
            readonly messageId: `msg-${string}`;
          }
        | undefined;
    };

    const { items: messages, lastEvaluatedKey: last } = await chatTable.query(
      {
        chatId: "chat-id",
        messageId: {
          $beginsWith: "msg-",
        },
      },
      {
        lastEvaluatedKey: a.lastEvaluatedKey,
      }
    );

    async function queryMessages() {
      const query = {
        chatId: "chat-id",
        messageId: {
          $beginsWith: "msg-",
        },
      } as const satisfies ChatTable.Query;
      let lastEvaluatedKey:
        | ChatTable.LastEvaluatedKey<typeof query>
        | undefined;
      const items: ChatTable.QueryItem<typeof query>[] = [];
      do {
        const response = await chatTable.query(query, {
          lastEvaluatedKey,
        });
        items.push(...response.items);
        lastEvaluatedKey = response.lastEvaluatedKey;
      } while (lastEvaluatedKey);
      return items;
    }

    async function queryMessages_2() {
      const query = {
        chatId: "chat-id",
        messageId: {
          $beginsWith: "msg-",
        },
      } as const satisfies ChatTable.Query;

      const messages: Message[] = [];
      for await (const message of chatTable.query.iter(query)) {
        messages.push(message);
      }
      return messages;
    }

    async function queryMessages_3<Q extends ChatTable.Query>(
      query: Q,
      lastEvaluatedKey?: ChatTable.LastEvaluatedKey<Q> | undefined
    ): Promise<ChatTable.QueryItem<Q>[]> {
      const response = await chatTable.query(query, {
        lastEvaluatedKey,
      });
      if (response.lastEvaluatedKey) {
        return [
          ...(response.items ?? []),
          ...(await queryMessages_3(query, response.lastEvaluatedKey)),
        ] as ChatTable.QueryItem<Q>[];
      } else {
        return response.items as ChatTable.QueryItem<Q>[];
      }
    }

    // @ts-expect-error - order must be userId -> name -> value for sort ket
    const { items: i2 } = await chatTable.query({
      userId: "",
      value: "",
    });

    const { items } = await chatTable.get(
      {
        $type: "Message",
        chatId: "chat-id",
        messageId: "messageId",
      },
      Message.Key({
        $type: "Message",
        chatId: "chat-id",
        messageId: "message-Id",
      })
    );
    const [message1, message2] = items;
    const t: "Message" | undefined = message1?.$type;
    const m: Message | undefined = message1;
    // @ts-expect-error
    const m2: Chat | undefined = message1;

    const result = await chatTable.query({
      chatId: "",
      messageId: {
        $beginsWith: "sam",
      },
    });
    result.items[0];
  }
}
