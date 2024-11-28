import { User } from "tweeter-shared";

export interface UserDao {
  createUser(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<void>;
  getUserFromAlias(alias: string): Promise<User | null>;
  verifyPassword(alias: string, inputPassword: string): Promise<boolean>;
}
