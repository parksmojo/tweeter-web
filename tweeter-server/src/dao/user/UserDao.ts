import { User } from "tweeter-shared";

export interface UserDao {
  createUser(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<void>;
  getUserFromAlias(alias: string): Promise<User | null>;
  getUserFromToken(token: string): Promise<User | null>;
  verifyPassword(alias: string, inputPassword: string): Promise<boolean>;
  setAuth(alias: string, token: string, timestamp: number): Promise<void>;
  deleteAuth(alias: string): Promise<void>;
}
