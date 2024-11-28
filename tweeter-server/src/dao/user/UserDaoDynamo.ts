import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDao } from "./UserDao";
import { User } from "tweeter-shared";
import { compare, genSalt, hash } from "bcryptjs";

export class UserDaoDynamo implements UserDao {
  private readonly userTable = "user";
  private readonly authTable = "auth";
  private readonly aliasAttr = "alias";
  private readonly passwordAttr = "password";
  private readonly firstNameAttr = "firstname";
  private readonly lastNameAttr = "lastname";
  private readonly tokenAttr = "token";
  private readonly timestampAttr = "lastused";
  private readonly imageUrlAttr = "imageurl";

  private client;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async hashWithSalt(plainText: string): Promise<string> {
    const salt = await genSalt();
    const hashedText = await hash(plainText, salt);
    return hashedText;
  }

  async createUser(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string
  ): Promise<void> {
    console.log("Entering userDaoDynamo.createUser()");
    const params = {
      TableName: this.userTable,
      Item: {
        [this.aliasAttr]: alias,
        [this.passwordAttr]: await this.hashWithSalt(password),
        [this.firstNameAttr]: firstName,
        [this.lastNameAttr]: lastName,
        [this.imageUrlAttr]: imageUrl,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async verifyPassword(alias: string, inputPassword: string): Promise<boolean> {
    console.log("Entering userDaoDynamo.verifyPassword()");
    const params = {
      TableName: this.userTable,
      Key: { [this.aliasAttr]: alias },
    };
    const result = await this.client.send(new GetCommand(params));
    return result.Item == undefined ? false : await compare(inputPassword, result.Item[this.passwordAttr]);
  }

  async getUserFromAlias(alias: string): Promise<User | null> {
    console.log("Entering userDaoDynamo.getUserFromAlias()");
    const params = {
      TableName: this.userTable,
      Key: { [this.aliasAttr]: alias },
    };
    const result = await this.client.send(new GetCommand(params));
    return result.Item == undefined
      ? null
      : new User(
          result.Item[this.firstNameAttr],
          result.Item[this.lastNameAttr],
          result.Item[this.aliasAttr],
          result.Item[this.imageUrlAttr]
        );
  }
}
