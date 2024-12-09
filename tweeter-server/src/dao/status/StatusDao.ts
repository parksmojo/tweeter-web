import { StatusDto, UserDto } from "tweeter-shared";

export interface StatusDao {
  savePost(status: StatusDto): Promise<void>;
  sendToFeeds(status: StatusDto): Promise<void>;
  addToFeed(follower: string, status: StatusDto): Promise<void>;
  getStoryPage(user: UserDto, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  getFeedPage(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
}
