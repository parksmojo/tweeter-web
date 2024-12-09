import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDao } from "./FollowDao";
import { UserDto } from "tweeter-shared";

export class FollowDaoDynamo implements FollowDao {
  readonly tableName = "follow";
  private readonly indexName = "follow-index";
  private readonly followerAttr = "follower_alias";
  private readonly followeeAttr = "followee_alias";

  private client;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async createFollow(follower: string, followee: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: follower,
        [this.followeeAttr]: followee,
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async follows(follower: string, followee: string): Promise<boolean> {
    console.log(`Checking if ${follower} follows ${followee}`);
    const params = {
      TableName: this.tableName,
      Key: { [this.followerAttr]: follower, [this.followeeAttr]: followee },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item !== undefined;
  }

  async deleteFollow(follower: string, followee: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [this.followerAttr]: follower, [this.followeeAttr]: followee },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getLiveFollowCounts(alias: string): Promise<[number, number]> {
    const params1 = {
      TableName: this.tableName,
      KeyConditionExpression: this.followerAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": alias,
      },
    };
    const output1 = await this.client.send(new QueryCommand(params1));
    const params2 = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: this.followeeAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": alias,
      },
    };
    const output2 = await this.client.send(new QueryCommand(params2));

    const follows = output1.Items ? output1.Items.length : 0;
    const followers = output2.Items ? output2.Items.length : 0;

    return [follows, followers];
  }

  async getFollowerPage(alias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.followeeAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": alias,
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.followerAttr]: lastItem,
              [this.followeeAttr]: alias,
            },
    };
    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item[this.followerAttr]));

    return [items, hasMorePages];
  }

  async getFolloweePage(alias: string, pageSize: number, lastItem: string | null): Promise<[string[], boolean]> {
    const params = {
      KeyConditionExpression: this.followerAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": alias,
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.followeeAttr]: lastItem,
              [this.followerAttr]: alias,
            },
    };
    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(item[this.followeeAttr]));

    return [items, hasMorePages];
  }

  async getAllFollowers(alias: string): Promise<string[]> {
    const params = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: this.followeeAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": alias,
      },
    };
    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    data.Items?.forEach((item) => items.push(item[this.followerAttr]));

    return items;
  }
}
