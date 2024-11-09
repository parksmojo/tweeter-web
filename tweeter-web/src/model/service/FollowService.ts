import { AuthToken, User, FakeData, Status, PagedUserItemRequest } from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  private server = new ServerFacade();

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    };
    return this.server.getMoreFollowers(request);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem,
    };
    return this.server.getMoreFollowees(request);
  }
}
