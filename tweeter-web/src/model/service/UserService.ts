import { AuthToken, User, FakeData } from "tweeter-shared";

export class UserService {
  public async extractAlias(value: string): Promise<string> {
    const index = value.indexOf("@");
    return value.substring(index);
  }
  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }
}
