import { AuthToken, User, FakeData, UserDto } from "tweeter-shared";
import { Buffer } from "buffer";

export class UserService {
  public async getUser(token: string, alias: string): Promise<UserDto> {
    const dto = FakeData.instance.findUserByAlias(alias)?.dto;
    if (!dto) {
      throw new Error("[Bad Request] User not found");
    }
    return dto;
  }

  public async getIsFollowerStatus(token: string, user: UserDto, selectedUser: UserDto): Promise<boolean> {
    return FakeData.instance.isFollower();
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    return FakeData.instance.getFolloweeCount(user.alias);
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    return FakeData.instance.getFollowerCount(user.alias);
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
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
  }
}
