import { AuthToken, User, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
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

  public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user.dto, FakeData.instance.authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    console.log(`Successfully logging out`);
  }

  public async followUser(token: string, selectedUser: UserDto): Promise<void> {
    console.log(`Following user: ${selectedUser}`);
  }

  public async unfollowUser(token: string, selectedUser: UserDto): Promise<void> {
    console.log(`Unollowing user: ${selectedUser}`);
  }
}
