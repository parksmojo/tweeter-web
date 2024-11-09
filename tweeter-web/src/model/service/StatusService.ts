import { AuthToken, Status, FakeData, PagedStatusItemRequest, PostStatusRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  private server = new ServerFacade();

  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem === null ? null : lastItem.dto,
    };
    return this.server.getMoreFeed(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const request: PagedStatusItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem === null ? null : lastItem.dto,
    };
    return this.server.getMoreStory(request);
  }

  public async postStatus(authToken: AuthToken, newStatus: Status): Promise<void> {
    console.log("Service posting status");
    const request: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus,
    };
    await this.server.postStatus(request);
  }
}
