import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Table } from "../src/aws/table";
import { createOrUpdateTable } from "../src/aws/crud";

export const client = new DynamoDBClient({
  endpoint: "http://0.0.0.0:4566",
});
export const documentClient = DynamoDBDocumentClient.from(client);

export async function prepareTable(table: Table<any>) {
  await createOrUpdateTable(table as any);

  let nextToken: string | undefined;
  do {
    const response = await table.scan({ nextToken });
    if (response.items?.length) {
      await table.delete(response.items);
    }
    nextToken = response.nextToken;
  } while (nextToken);
}
