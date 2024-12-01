import { StatusDto, UserDto } from "tweeter-shared";
import { StatusDao } from "./StatusDao";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class StatusDaoDynamo implements StatusDao {
  private readonly tableName = "story";
  private readonly userAttr = "author";
  private readonly timestampAttr = "posttime";
  private readonly postAttr = "post";
  private readonly segmentsAttr = "segments";

  private client;

  constructor() {
    this.client = DynamoDBDocumentClient.from(new DynamoDBClient());
  }

  async savePost(status: StatusDto): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        [this.userAttr]: JSON.stringify(status.user),
        [this.timestampAttr]: status.timestamp,
        [this.postAttr]: status.post,
        [this.segmentsAttr]: JSON.stringify(status.segments),
      },
    };
    await this.client.send(new PutCommand(params));
  }

  async getStoryPage(user: UserDto, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    const params = {
      KeyConditionExpression: this.userAttr + " = :loc",
      ExpressionAttributeValues: {
        ":loc": JSON.stringify(user),
      },
      TableName: this.tableName,
      Limit: pageSize,
      ExclusiveStartKey:
        lastItem === null
          ? undefined
          : {
              [this.userAttr]: JSON.stringify(lastItem.user),
              [this.timestampAttr]: lastItem.timestamp,
              [this.postAttr]: lastItem.post,
              [this.segmentsAttr]: JSON.stringify(lastItem.segments),
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
    throw new Error("Method not yet implemented");
  }
}
