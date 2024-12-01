import { User, FakeData, UserDto } from "tweeter-shared";
import { DaoFactory } from "../../dao/factory/DaoFactory";
import { Service } from "./Service";
import { FollowDao } from "../../dao/follow/FollowDao";
import { UserDao } from "../../dao/user/UserDao";

export class FollowService extends Service {
  private followDao: FollowDao;
  private userDao: UserDao;

  constructor(daoFactory: DaoFactory) {
    super(daoFactory);
    this.followDao = daoFactory.getFollowDao();
    this.userDao = daoFactory.getUserDao();
  }

  private async loadMoreFollows(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null,
    getPage: (userAlias: string, pageSize: number, lastItem: UserDto | null) => Promise<[string[], boolean]>
  ): Promise<[UserDto[], boolean]> {
    await this.verifyAuth(token);

    const [follows, hasMore] = await getPage(userAlias, pageSize, lastItem);

    const followers = await Promise.all(follows.map((alias) => this.userDao.getUserFromAlias(alias)));

    return [followers.filter((user): user is UserDto => !!user), hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await this.loadMoreFollows(token, userAlias, pageSize, lastItem, () =>
      this.followDao.getFollowerPage(userAlias, pageSize, lastItem)
    );
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await this.loadMoreFollows(token, userAlias, pageSize, lastItem, (user, count, last) =>
      this.followDao.getFolloweePage(user, count, last)
    );
  }
}
