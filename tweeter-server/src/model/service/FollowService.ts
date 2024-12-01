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
    getPage: (userAlias: UserDto, pageSize: number, lastItem: UserDto | null) => Promise<[UserDto[], boolean]>
  ): Promise<[UserDto[], boolean]> {
    await this.verifyAuth(token);

    const user = await this.userDao.getUserFromAlias(userAlias);
    if (!user) {
      throw new Error(`[Bad Request] User ${userAlias} not found`);
    }
    const [follows, hasMore] = await getPage(user, pageSize, lastItem);

    const followers = await Promise.all(follows.map((user) => this.userDao.getUserFromAlias(user.alias)));

    return [followers.filter((user): user is UserDto => !!user), hasMore];
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    return await this.loadMoreFollows(token, userAlias, pageSize, lastItem, (user: UserDto, count, last) =>
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
