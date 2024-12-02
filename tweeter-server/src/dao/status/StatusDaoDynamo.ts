import { StatusDto, UserDto } from "tweeter-shared";
import { StatusDao } from "./StatusDao";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class StatusDaoDynamo implements StatusDao {
  private readonly storyTableName = "story";
  private readonly feedTableName = "feed";
  private readonly userAttr = "author";
  private readonly aliasAttr = "alias";
  private readonly timestampAttr = "posttime";
  private readonly postAttr = "post";
  private readonly segmentsAttr = "segments";

  private client;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async savePost(status: StatusDto, followers: string[]): Promise<void> {
    const params = {
      TableName: this.storyTableName,
      Item: {
        [this.userAttr]: JSON.stringify(status.user),
        [this.timestampAttr]: status.timestamp,
        [this.postAttr]: status.post,
        [this.segmentsAttr]: JSON.stringify(status.segments),
      },
    };
    await this.client.send(new PutCommand(params));
    for (let follower of followers) {
      await this.client.send(
        new PutCommand({
          TableName: this.feedTableName,
          Item: {
            [this.aliasAttr]: follower,
            [this.userAttr]: JSON.stringify(status.user),
            [this.timestampAttr]: status.timestamp,
            [this.postAttr]: status.post,
            [this.segmentsAttr]: JSON.stringify(status.segments),
          },
        })
      );
    }
  }

  async getStoryPage(user: UserDto, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    console.log(`Getting story after:`, lastItem);
    console.log("LastItem user:", lastItem?.user);
    const params = {
      KeyConditionExpression: this.userAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": JSON.stringify(user),
      },
      TableName: this.storyTableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.userAttr]: JSON.stringify(lastItem.user),
              [this.timestampAttr]: lastItem.timestamp,
            },
    };
    const items: StatusDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push({
        user: JSON.parse(item[this.userAttr]),
        post: item[this.postAttr],
        timestamp: item[this.timestampAttr],
        segments: JSON.parse(item[this.segmentsAttr]),
      })
    );

    return [items, hasMorePages];
  }

  async getFeedPage(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.aliasAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": alias,
      },
      TableName: this.feedTableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.aliasAttr]: alias,
              [this.timestampAttr]: lastItem.timestamp,
            },
    };
    const items: StatusDto[] = [];
    const data = await this.client.send(new QueryCommand(params));
    const hasMorePages = data.LastEvaluatedKey !== undefined;
    data.Items?.forEach((item) =>
      items.push({
        user: JSON.parse(item[this.userAttr]),
        post: item[this.postAttr],
        timestamp: item[this.timestampAttr],
        segments: JSON.parse(item[this.segmentsAttr]),
      })
    );

    return [items, hasMorePages];
  }
}
