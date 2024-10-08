import { AuthToken, User, FakeData } from "tweeter-shared";
import { Buffer } from "buffer";

export class UserService {
  public async extractAlias(value: string): Promise<string> {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }

  public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    console.log(`Successfully logging in ${alias}`);
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    console.log(`Successfully registering ${alias}`);
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }
}
