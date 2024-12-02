import { StatusDto, UserDto } from "tweeter-shared";

export interface StatusDao {
  savePost(status: StatusDto, followers: string[]): Promise<void>;
  getStoryPage(user: UserDto, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
  getFeedPage(alias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]>;
}
