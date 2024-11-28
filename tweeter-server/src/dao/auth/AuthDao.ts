import { AuthToken } from "tweeter-shared";

export interface AuthDao {
  setAuth(alias: string, token: string, timestamp: number): Promise<void>;
  updateAuth(token: string, time: number): Promise<void>;
  getAuth(token: string): Promise<AuthToken | null>;
  deleteAuth(token: string): Promise<void>;
  getAliasFromAuth(token: string): Promise<string | null>;
}
