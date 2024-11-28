import { Status, StatusDto, FakeData } from "tweeter-shared";
import { Service } from "./Service";
import { DaoFactory } from "../../dao/factory/DaoFactory";

export class StatusService extends Service {
  constructor(daoFactory: DaoFactory) {
    super(daoFactory);
  }

  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    return await this.getFakeData(lastItem, pageSize);
  }

  private async getFakeData(lastItem: StatusDto | null, pageSize: number): Promise<[StatusDto[], boolean]> {
    const [statuses, hasMore] = FakeData.instance.getPageOfStatuses(Status.fromDto(lastItem), pageSize);
    const statusDtos = statuses.map((status) => status.dto);
    return [statusDtos, hasMore];
  }

  public async postStatus(token: string, newStatus: StatusDto): Promise<void> {
    console.log("Posting status:", newStatus);
  }
}
