import { User, UserDto } from "tweeter-shared";

export interface UserDao {
  createUser(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<void>;
  getUsers(pageSize: number, lastItem: string | null): Promise<[string[], boolean]>;
  getUserFromAlias(alias: string): Promise<UserDto | null>;
  verifyPassword(alias: string, inputPassword: string): Promise<boolean>;
  setFollowCounts(alias: string, followsCount: number, followerCount: number): Promise<void>;
  getFollowCounts(alias: string): Promise<[number, number]>;
}
