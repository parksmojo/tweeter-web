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

  async createFollow(follower: UserDto, followee: UserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.followerAttr]: JSON.stringify(follower),
        [this.followeeAttr]: JSON.stringify(followee),
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async follows(follower: UserDto, followee: UserDto): Promise<boolean> {
    console.log(`Checking if ${follower.alias} follows ${followee.alias}`);
    const params = {
      TableName: this.tableName,
      Key: { [this.followerAttr]: JSON.stringify(follower), [this.followeeAttr]: JSON.stringify(followee) },
    };
    const output = await this.client.send(new GetCommand(params));
    return output.Item !== undefined;
  }

  async deleteFollow(follower: UserDto, followee: UserDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { [this.followerAttr]: JSON.stringify(follower), [this.followeeAttr]: JSON.stringify(followee) },
    };
    await this.client.send(new DeleteCommand(params));
  }

  async getFollowCounts(user: UserDto): Promise<[number, number]> {
    const params1 = {
      TableName: this.tableName,
      KeyConditionExpression: this.followerAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": JSON.stringify(user),
      },
    };
    const output1 = await this.client.send(new QueryCommand(params1));
    const params2 = {
      TableName: this.tableName,
      IndexName: this.indexName,
      KeyConditionExpression: this.followeeAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": JSON.stringify(user),
      },
    };
    const output2 = await this.client.send(new QueryCommand(params2));

    const follows = output1.Items ? output1.Items.length : 0;
    const followers = output2.Items ? output2.Items.length : 0;

    return [follows, followers];
  }

  async getFollowerPage(user: UserDto, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.followeeAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": JSON.stringify(user),
      },
      TableName: this.tableName,
      IndexName: this.indexName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.followerAttr]: lastItem.alias,
              [this.followeeAttr]: JSON.stringify(user),
            },
    };
    const items: UserDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(JSON.parse(item[this.followerAttr])));

    return [items, hasMorePages];
  }

  async getFolloweePage(user: UserDto, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.followerAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": JSON.stringify(user),
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.followeeAttr]: lastItem.alias,
              [this.followerAttr]: JSON.stringify(user),
            },
    };
    const items: UserDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) => items.push(JSON.parse(item[this.followeeAttr])));

    return [items, hasMorePages];
  }

  async getAllFollows(user: UserDto): Promise<string[]> {
    const params = {
      KeyConditionExpression: this.followerAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": JSON.stringify(user),
      },
      TableName: this.tableName,
    };
    const items: string[] = [];
    const data = await this.client.send(new QueryCommand(params));
    data.Items?.forEach((item) => items.push(item[this.followeeAttr]));

    return items;
  }
}
