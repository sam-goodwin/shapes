# Shapes

Shapes is a tiny, schema and data modeling library for TypeScript.

- ✨ Drop-in replacement for [Zod](https://www.npmjs.com/package/zod)
- 📦 Tiny (~3.4KB) bundle size impact - ideal for frontend or serverless environments
- 🚀 Fast compilation speed - no more sluggish IDE or compile times with types optimized for TypeScript 5
- 🟩 Complementary ["shapes"](#shapes) for modeling databases and APIs, such as DynamoDB, Deno KV and more.

```typescript
import s from "shapes";

class Post = s.class({
  title: s.string(),
  content: s.string(),
  likes: s.number(),
}) {}

class User extends s.class({
  username: s.string(),
  age: s.number(),
  email: s.string().optional(),
  posts: s.array(Post),
  parent: s.this<User>().optional(),
}) {}

const user = User.parse({ .. })
```

# Comparisons with other Schema libraries

## Bundle Size

| Library                                            | esbuild | esbuild (minified) | WebPack |
| -------------------------------------------------- | ------- | ------------------ | ------- |
| [Shapes](https://github.com/sam-goodwin/shapes) 🚀 | 6.9K    | 3.4K               | 3.4K    |
| [Zod](https://github.com/colinhacks/zod)           | 107K    | 52K                | 52K     |
| [Effect](https://github.com/Effect-TS/schema)      | 332K    | 134K               | 116K    |
| [Arktype](https://github.com/arktypeio/arktype)    | 110K    | 46K                | 46K     |
| [Typebox](https://github.com/sinclairzx81/typebox) | 86K     | 36K                | 33K     |
| [Yup](https://github.com/jquense/yup)              | 88K     | 40K                | 34K     |

<details>
<summary>Click to learn how we achieve a small bundle</summary>

This is a collapsible section.

</details>

## Compilation Speed

## Features

| Feature    | Shapes | Zod                                              | Effect | Arktype | Typebox | Yup |
| ---------- | ------ | ------------------------------------------------ | ------ | ------- | ------- | --- |
| Primitives | ✅     | ✅                                               | ✅     | ✅      | ✅      | ✅  |
| Objects    | ✅     | ✅                                               | ✅     | ✅      | ✅      | ✅  |
| Arrays     | ✅     | ✅                                               | ✅     | ✅      | ✅      | ✅  |
| Validation | ✅     | ✅                                               | ✅     | ✅      | ✅      | ✅  |
| Recursive  | ✅     | ✅                                               | ✅     | ✅      | ✅      | ✅  |
| This       | ✅     | ❌                                               | ❌     | ✅      | ❌      | ❌  |
| Class      | ✅     | ❌ [?](https://github.com/sam-goodwin/zod-class) | ✅     | ✅      | ❌      | ❌  |

## Usage

Shapes is a library for schema validation and data modeling. It can be used to parse data in APIs and model database schemas.

### String

```typescript
const str = s.string();
```

### Number

```typescript
const num = s.number();
```

### Object

```typescript
const User = s.object({
  username: s.string(),
  age: s.number(),
});
```

### Class

```typescript
class User extends s.class({
  username: s.string(),
  age: s.number(),
}) {}
```

### This

`s.this()` can be used for defining circular self-referential types - i.e. object types that contain references to other instances of itself.

#### Usage in Object Types

```typescript
type User = s.infer<typeof User>;
const User = s.object({
  username: s.string(),
  age: s.number(),
  parent: s.this().optional(),
});
```

#### Usage in Class Types

```typescript
class User extends s.class({
  username: s.string(),
  age: s.number(),
  parent: s.this<User>().optional(),
}) {}
```

In class types, due to limitations in TypeScript, you need to annotate `s.this()` with the "User" type.

# Shapes

Shapes is all about modeling data and provides complementary libraries wo

## DynamoDB Table

The [DynamoDB Shape](./src/aws/README.md) offers a type-safe interface for single table design in DynamoDB.

First, you create one or more **Entities**

```typescript
import { entity, table } from "shapes/aws/dynamodb";
import s from "shapes";

class Chat extends entity("Chat", {
  pk: ["chatId"],
  attributes: {
    chatId: s.string(),
    userId: s.string(),
    title: s.string().optional(),
    createTime: s.string(),
    updateTime: s.string(),
  },
}) {}

class Message extends entity("Message", {
  pk: ["chatId"],
  sk: ["messageId"],
  attributes: {
    chatId: s.string(),
    messageId: s.string(),
    userId: s.string(),
    message: s.string(),
    createTime: s.string(),
    updateTime: s.string().optional(),
  },
}) {}
```

Then, define a `table` for storing those Entities.

```ts
// define a class to represent the table and its entities
class ChatTable extends table({
  entities: {
    Chat,
    Message,
  },
}) {}

// instantiate that class to receive a client
const chatTable = new ChatTable({
  tableName: "test_table",
  client: DocumentDBClient.from(new DynamoDBClient({})),
});
```

Now, you can read and write data to that table with a simple, type-safe, schema-aware syntax:

```ts
await chatTable.put(
  new Chat({
    chatId: "chat-id",
    userId: "user-id",
    title: "Chat Title",
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  }),
  new Message({
    chatId: "chat-id",
    messageId: "message-id",
    userId: "user-id",
    message: "Hello, world!",
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
  })
);

// based on key, we know that a Chat will be returned
const chat: Chat | undefined = await chatTable.get({
  chatId: "chat-id",
});

// based on key, we know that a Message will be returned
const message: Message | undefined = await chatTable.get({
  chatId: "chat-id",
  messageId: "message-id",
});

// based on query, type-safe awareness that either a Chat | Message will be returned
const chatOrMessage: QueryResult<Chat | Message> = await chatTable.query({
  chatId: "chat-id",
});

// based on query, we know that only Message data types will be returned
const message: QueryResult<Message> = await chatTable.query({
  chatId: "chat-id",
  messageId: {
    $beginsWith: "message-id",
  },
});
```

## Open API Schema

> Coming Soon! 🔧

## LLM Structured Data Outputs

> Coming Soon! 🔧

## Deno KV

> Coming Soon! 🔧

## Drizzle Kit

> Coming Soon! 🔧
