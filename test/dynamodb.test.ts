import { test } from "bun:test";

import i from "../src/index.js";
import {
  LastEvaluatedKey as _LastEvaluatedKey,
  QueryExpression,
  entity,
  table,
} from "../src/aws/dynamodb.js";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

class User extends entity("User", {
  pk: ["userId"],
  sk: ["name", "value"],
  attributes: {
    userId: i.string(),
    name: i.string(),
    value: i.string(),
  },
}) {
  getUsername() {
    return this.$type;
  }
}

class Chat extends entity("Chat", {
  pk: ["chatId"],
  attributes: {
    chatId: i.string(),
    userId: i.string(),
  },
}) {}

class Message extends entity("Message", {
  pk: ["chatId"],
  sk: ["messageId"],
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

test("dynamodb", async () => {
  const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  const chatTable = new ChatTable(documentClient);

  async function _() {
    const chat1 = (await chatTable.get(
      Chat.Key({
        chatId: "chat",
      })
    )) satisfies {
      item: Chat;
    };

    const chat2 = (await chatTable.chat.get({
      chatId: "chatID",
    })) satisfies Chat & {
      readonly chatId: "chatID";
    };

    const kk = Chat.Key({
      chatId: "chat1",
    }) satisfies {
      readonly chatId: "chat1";
      $type: "Chat";
    };

    const {
      items: [chat3, chat4, message],
    } = (await chatTable.get(
      kk,
      Chat.Key({
        chatId: "chat3",
      }),
      Message.Key({
        chatId: "chat3",
        messageId: "message",
      })
    )) satisfies {
      items: readonly [Chat | undefined, Chat | undefined, Message | undefined];
    };

    const {
      items: [chat3_1, chat4_1, message_1],
    } = await chatTable.get([
      kk,
      Chat.Key({
        chatId: "chat3",
      }),
      Message.Key({
        chatId: "chat3",
        messageId: "message",
      }),
    ]);

    const { items: users, lastEvaluatedKey } = (await chatTable.user.query({
      userId: "user",
      name: "sam",
      value: {
        $beginsWith: "1",
      },
    })) satisfies {
      items: User[];
      lastEvaluatedKey: typeof User.Key.$infer;
    };

    const { items: users3 } = await chatTable.user.query({
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
      } satisfies ChatTable.Query;
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
        chatId: "chat-id",
        messageId: "message-Id",
      })
    );
    const [message1, message2] = items;
    const t: "Message" = message.$type;
    const m: Message = message1;
    // @ts-expect-error
    const m2: Chat = message1;

    const result = await chatTable.query({
      chatId: "",
      messageId: {
        $beginsWith: "sam",
      },
    });
    result.items[0];
  }
});
