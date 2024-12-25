import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AuthDao } from "./AuthDao";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AuthToken } from "tweeter-shared";

export class AuthDaoDynamo implements AuthDao {
  private readonly authTable = "auth";
  private readonly aliasAttr = "alias";
  private readonly tokenAttr = "token";
  private readonly timestampAttr = "lastused";

  private client;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async setAuth(alias: string, token: string, timestamp: number): Promise<void> {
    console.log("Entering authDaoDynamo.setAuth()");
    const params = {
      TableName: this.authTable,
      Item: {
        [this.tokenAttr]: token,
        [this.timestampAttr]: timestamp,
        [this.aliasAttr]: alias,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getAuth(token: string): Promise<AuthToken | null> {
    console.log("Entering authDaoDynamo.getAuth()");
    const params = {
      TableName: this.authTable,
      Key: { [this.tokenAttr]: token },
    };
    const result = await this.client.send(new GetCommand(params));
    return result.Item == undefined ? null : new AuthToken(token, result.Item[this.timestampAttr]);
  }

  async updateAuth(token: string, time: number): Promise<void> {
    console.log("Entering authDaoDynamo.updateAuth()");
    const params = {
      TableName: this.authTable,
      Key: { [this.tokenAttr]: token },
      UpdateExpression: "SET #timeEdited = :newTime",
      ExpressionAttributeNames: {
        "#timeEdited": this.timestampAttr,
      },
      ExpressionAttributeValues: {
        ":newTime": time,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  async deleteAuth(token: string): Promise<void> {
    console.log("Entering authDaoDynamo.deleteAuth()");
    const params = {
      TableName: this.authTable,
      Key: { [this.tokenAttr]: token },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getAliasFromAuth(token: string): Promise<string | null> {
    console.log("Entering authDaoDynamo.getAliasFromAuth()");
    const params = {
      TableName: this.authTable,
      Key: { [this.tokenAttr]: token },
    };
    const result = await this.client.send(new GetCommand(params));
    return result.Item == undefined ? null : result.Item[this.aliasAttr];
  }
}
