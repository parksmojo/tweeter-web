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

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    await this.verifyAuth(token);
    await this.statusDao.savePost(newStatus);
    // await this.statusDao.sendToFeeds(newStatus); Old sqs way of getting posts to feeds
    const alias = await this.authDao.getAliasFromAuth(token);
    const followers = await this.followDao.getAllFollowers(alias!);
    for (let follower of followers) {
      await this.statusDao.addToFeed(follower, newStatus);
    }
  }

  public async makeFeedJobAssignments(status: StatusDto) {
    console.log("Sending feed jobs for all followers");
    let followers: string[] = [];
    let hasMore = true;
    let lastItem = null;
    while (hasMore) {
      [followers, hasMore] = await this.followDao.getFollowerPage(status.user.alias, 100, lastItem);
      await this.statusDao.sendFeedJob(status, followers);
      lastItem = followers.at(-1) ?? null;
    }
    console.log("Sent feed jobs for all followers");
  }

  public async updateFeeds(status: StatusDto, followers: string[]) {
    console.log(`Updating feeds for users from ${followers[0]} to ${followers[followers.length - 1]}`);
    for (let follower of followers) {
      await this.statusDao.addToFeed(follower, status);
    }
  }
}
