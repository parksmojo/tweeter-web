import { Status, StatusDto, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/factory/DaoFactory";
import { StatusDao } from "../../dao/status/StatusDao";
import { UserDao } from "../../dao/user/UserDao";
import { FollowDao } from "../../dao/follow/FollowDao";

export class StatusService extends Service {
  private statusDao: StatusDao;
  private userDao: UserDao;
  private followDao: FollowDao;

  constructor(daoFactory: DaoFactory) {
    super(daoFactory);
    this.statusDao = daoFactory.getStatusDao();
    this.userDao = daoFactory.getUserDao();
    this.followDao = daoFactory.getFollowDao();
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.verifyAuth(token);
    return await this.statusDao.getFeedPage(userAlias, pageSize, lastItem);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    await this.verifyAuth(token);

    const user = await this.userDao.getUserFromAlias(userAlias);
    if (!user) {
      throw new Error("[Bad Request] User not found");
    }

    return await this.statusDao.getStoryPage(user, pageSize, lastItem);
  }

  private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const statusDtos = statuses.map((status) => status.dto);
    return [statusDtos, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.verifyAuth(token);
    const userAlias = await this.authDao.getAliasFromAuth(token);
    const followers = await this.followDao.getAllFollowers(userAlias!);
    await this.statusDao.savePost(newStatus, followers);
  }
}
