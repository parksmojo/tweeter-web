import {
  AuthToken,
  User,
  FakeData,
  GetUserRequest,
  GetIsFollowerRequest,
  GetFollowerCountRequest,
} from "tweeter-shared";
import { Buffer } from "buffer";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  private server = new ServerFacade();

  public async extractAlias(value: string): Promise<string> {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async getUser(authToken: AuthToken, alias: string): Promise<User | null> {
    const request: GetUserRequest = {
      token: authToken.token,
      alias: alias,
    };
    return this.server.getUser(request);
  }

  public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    const request: GetIsFollowerRequest = {
      token: authToken.token,
      user: user,
      selectedUser: selectedUser,
    };
    return this.server.getIsFollower(request);
  }

  public async getFolloweeCount(authToken: AuthToken, user: User): Promise<number> {
    const request: GetFollowerCountRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return await this.server.getFollowCount("followee", request);
  }

  public async getFollowerCount(authToken: AuthToken, user: User): Promise<number> {
    const request: GetFollowerCountRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return await this.server.getFollowCount("follower", request);
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

  public async logout(authToken: AuthToken): Promise<void> {
    console.log(`Successfully logging out`);
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }
}
