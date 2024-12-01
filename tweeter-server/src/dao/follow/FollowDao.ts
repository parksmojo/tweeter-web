import { UserDto } from "tweeter-shared";

export interface FollowDao {
  createFollow(follower: UserDto, followee: UserDto): Promise<void>;
  follows(follower: UserDto, followee: UserDto): Promise<boolean>;
  deleteFollow(follower: UserDto, followee: UserDto): Promise<void>;
  getFollowCounts(user: UserDto): Promise<[number, number]>;
  getFollowerPage(user: UserDto, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
  getFolloweePage(user: UserDto, pageSize: number, lastItem: UserDto | null): Promise<[UserDto[], boolean]>;
  getAllFollows(user: UserDto): Promise<string[]>;
}
