import {
  AuthToken,
  User,
  FakeData,
  GetUserRequest,
  GetIsFollowerRequest,
  GetFollowerCountRequest,
  LoginRequest,
  RegisterRequest,
  TweeterRequest,
  FollowRequest,
  PagedUserItemRequest,
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

  public async loadMoreUsers(
    authToken: AuthToken,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: "",
      pageSize: pageSize,
      lastItem: lastItem === null ? null : lastItem.dto,
    };
    return this.server.getMoreUsers(request);
  }

  public async getIsFollowerStatus(authToken: AuthToken, user: User, selectedUser: User): Promise<boolean> {
    const request: GetIsFollowerRequest = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
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
    const request: LoginRequest = {
      token: "",
      alias: "@" + alias,
      password: password,
    };
    const [user, authToken] = await this.server.login(request);

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    const imageStringBase64: string = Buffer.from(userImageBytes).toString("base64");

    const request: RegisterRequest = {
      token: "",
      firstName: firstName,
      lastName: lastName,
      alias: "@" + alias,
      password: password,
      imageStringBase64: imageStringBase64,
      imageFileExtension: imageFileExtension,
    };
    const [user, authToken] = await this.server.register(request);

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    const request: TweeterRequest = {
      token: authToken.token,
    };
    await this.server.logout(request);
  }

  public async followUser(authToken: AuthToken, selectedUser: User): Promise<void> {
    const request: FollowRequest = {
      token: authToken.token,
      selectedUser: selectedUser.dto,
    };
    await this.server.followUser(request);
  }

  public async unfollowUser(authToken: AuthToken, selectedUser: User): Promise<void> {
    const request: FollowRequest = {
      token: authToken.token,
      selectedUser: selectedUser.dto,
    };
    await this.server.unfollowUser(request);
  }
}
