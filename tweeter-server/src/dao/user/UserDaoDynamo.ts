import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UserDao } from "./UserDao";
import { User, UserDto } from "tweeter-shared";
import { compare, genSalt, hash } from "bcryptjs";

export class UserDaoDynamo implements UserDao {
  private readonly userTable = "user";
  private readonly aliasAttr = "alias";
  private readonly passwordAttr = "password";
  private readonly firstNameAttr = "firstname";
  private readonly lastNameAttr = "lastname";
  private readonly imageUrlAttr = "imageurl";
  private readonly followsCountAttr = "follows_count";
  private readonly followersCountAttr = "followers_count";

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
        [this.followsCountAttr]: 0,
        [this.followersCountAttr]: 0,
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

  async getUsers(pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
    const params = {
      TableName: this.userTable,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.aliasAttr]: lastItem,
            },
    };
    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item[this.aliasAttr]));

    return [items, hasMorePages];
  }

  async getUserFromAlias(alias: string): Promise<UserDto | null> {
    console.log(`Entering userDaoDynamo.getUserFromAlias(${alias})`);
    const params = {
      TableName: this.userTable,
      Key: { [this.aliasAttr]: alias },
    };
    const result = await this.client.send(new GetCommand(params));
    return result.Item == undefined
      ? null
      : {
          firstName: result.Item[this.firstNameAttr],
          lastName: result.Item[this.lastNameAttr],
          alias: result.Item[this.aliasAttr],
          imageUrl: result.Item[this.imageUrlAttr],
        };
  }

  async setFollowCounts(alias: string, followsCount: number, followerCount: number): Promise<void> {
    const params = {
      TableName: this.userTable,
      Key: { [this.aliasAttr]: alias },
      UpdateExpression: "SET #followsCount = :newFollowsCount, #followerCount = :newFollowerCount",
      ExpressionAttributeNames: {
        "#followsCount": this.followsCountAttr,
        "#followerCount": this.followersCountAttr,
      },
      ExpressionAttributeValues: {
        ":newFollowsCount": followsCount,
        ":newFollowerCount": followerCount,
      },
    };
    await this.client.send(new UpdateCommand(params));
  }

  async getFollowCounts(alias: string): Promise<[number, number]> {
    console.log("Entering userDaoDynamo.getFollowCounts()");
    const params = {
      TableName: this.userTable,
      Key: { [this.aliasAttr]: alias },
    };
    const result = await this.client.send(new GetCommand(params));
    return [result.Item![this.followsCountAttr], result.Item![this.followersCountAttr]];
  }
}
