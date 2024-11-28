import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { FollowDao } from "./FollowDao";

export class FollowDaoDynamo implements FollowDao {
  private readonly tableName = "follow";
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
}
