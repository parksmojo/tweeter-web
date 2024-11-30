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
    this.verifyAuth(token);

    const [followerAliases, hasMore] = await getPage(userAlias, pageSize, lastItem);

    const followers = await Promise.all(followerAliases.map((alias) => this.userDao.getUserFromAlias(alias)));

    return [followers.filter((user): user is UserDto => !!user), hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await this.loadMoreFollows(token, userAlias, pageSize, lastItem, (user, count, last) =>
      this.followDao.getFollowerPage(user, count, last)
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
