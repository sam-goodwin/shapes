import {
  CreateTableCommand,
  CreateTableCommandInput,
  GlobalSecondaryIndex,
} from "@aws-sdk/client-dynamodb";
import { Table } from "./table.js";

export async function createOrUpdateTable(table: Table<any>) {
  const indexNames = Array.from(
    new Set<string>(
      Object.values(table.entities).flatMap((e: any) => {
        return e.traits.indexes ? Object.keys(e.traits.indexes) : [];
      })
    )
  );
  const KeySchema = [
    { AttributeName: "$pk", KeyType: "HASH" },
    { AttributeName: "$sk", KeyType: "RANGE" },
  ];
  const gsis = indexNames.map((indexName) => {
    const _KeySchema = [
      { AttributeName: `$pk_${indexName}`, KeyType: "HASH" },
      { AttributeName: `$sk_${indexName}`, KeyType: "RANGE" },
    ];
    KeySchema.push(..._KeySchema);
    return {
      IndexName: indexName,
      KeySchema: _KeySchema,
      Projection: {
        ProjectionType: "ALL",
      },
    } as GlobalSecondaryIndex;
  });
  try {
    const args: CreateTableCommandInput = {
      BillingMode: "PAY_PER_REQUEST",
      TableName: table.tableName,
      KeySchema: [
        { AttributeName: "$pk", KeyType: "HASH" },
        { AttributeName: "$sk", KeyType: "RANGE" },
      ],
      AttributeDefinitions: [
        { AttributeName: "$pk", AttributeType: "S" },
        { AttributeName: "$sk", AttributeType: "S" },
      ],
      GlobalSecondaryIndexes: gsis?.length ? gsis : undefined!,
    };
    await table.client.send(new CreateTableCommand(args));
  } catch (err: any) {
    console.log("Table already exists");
  }
}
