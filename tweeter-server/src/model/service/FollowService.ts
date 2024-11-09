import { AuthToken, User, FakeData, Status, UserDto } from "tweeter-shared";

export class FollowService {
  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(User.fromDto(lastItem), pageSize, userAlias);
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
