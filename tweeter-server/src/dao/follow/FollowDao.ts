import { UserDto } from "tweeter-shared";

export interface FollowDao {
  createFollow(follower: string, followee: string): Promise<void>;
  follows(follower: string, followee: string): Promise<boolean>;
  deleteFollow(follower: string, followee: string): Promise<void>;
  getFollowCounts(alias: string): Promise<[number, number]>;
  getFollowerPage(alias: string, pageSize: number, lastItem: UserDto | null): Promise<[string[], boolean]>;
  getFolloweePage(alias: string, pageSize: number, lastItem: UserDto | null): Promise<[string[], boolean]>;
}
