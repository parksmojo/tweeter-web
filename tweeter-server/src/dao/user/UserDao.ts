import { User } from "tweeter-shared";

export interface UserDao {
  createUser(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): Promise<void>;
  getUser(alias: string): Promise<User | null>;
  setAuth(alias: string, token: string, timestamp: number): Promise<void>;
  verifyPassword(alias: string, inputPassword: string): Promise<boolean>;
}
