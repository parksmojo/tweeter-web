import { AuthToken, User, UserDto, AuthTokenDto } from "tweeter-shared";
import { FileDao } from "../../dao/file/FileDao";
import { UserDao } from "../../dao/user/UserDao";
import { DaoFactory } from "../../dao/factory/DaoFactory";
import { Service } from "./Service";
import { FollowDao } from "../../dao/follow/FollowDao";

export class UserService extends Service {
  private fileDao: FileDao;
  private userDao: UserDao;
  private followDao: FollowDao;

  constructor(daoFactory: DaoFactory) {
    super(daoFactory);
    this.fileDao = daoFactory.getFileDao();
    this.userDao = daoFactory.getUserDao();
    this.followDao = daoFactory.getFollowDao();
  }

  public async getUser(token: string, alias: string): Promise<UserDto> {
    await this.verifyAuth(token);
    const dto = await this.userDao.getUserFromAlias(alias);
    if (!dto) {
      throw new Error("[Bad Request] User not found");
    }
    return dto;
  }

  private async updateFollowCounts(alias: string): Promise<void> {
    const user = await this.userDao.getUserFromAlias(alias);
    if (!user) {
      throw new Error("[Bad Request] User not found");
    }
    const [followsCount, followerCount] = await this.followDao.getFollowCounts(user);
    this.userDao.setFollowCounts(alias, followsCount, followerCount);
  }

  private async changeFollow(
    token: string,
    selectedUser: UserDto,
    followFunc: (follower: UserDto, followee: UserDto) => Promise<void>
  ): Promise<void> {
    await this.verifyAuth(token);
    const followerAlias = (await this.authDao.getAliasFromAuth(token))!;
    const follower = (await this.userDao.getUserFromAlias(followerAlias))!;
    await followFunc(follower, selectedUser);
    this.updateFollowCounts(followerAlias);
    this.updateFollowCounts(selectedUser.alias);
  }

  public async followUser(token: string, selectedUser: UserDto): Promise<void> {
    await this.changeFollow(token, selectedUser, (follower: UserDto, followee: UserDto) =>
      this.followDao.createFollow(follower, followee)
    );
  }

  public async unfollowUser(token: string, selectedUser: UserDto): Promise<void> {
    await this.changeFollow(token, selectedUser, (follower: UserDto, followee: UserDto) =>
      this.followDao.deleteFollow(follower, followee)
    );
  }

  public async getIsFollowerStatus(token: string, user: UserDto, selectedUser: UserDto): Promise<boolean> {
    await this.verifyAuth(token);
    return this.followDao.follows(user, selectedUser);
  }

  public async getFolloweeCount(token: string, user: UserDto): Promise<number> {
    await this.verifyAuth(token);
    const [followsCount, followerCount] = await this.followDao.getFollowCounts(user);
    return followsCount;
  }

  public async getFollowerCount(token: string, user: UserDto): Promise<number> {
    await this.verifyAuth(token);
    const [followsCount, followerCount] = await this.followDao.getFollowCounts(user);
    return followerCount;
  }

  public async login(alias: string, password: string): Promise<[UserDto, AuthTokenDto]> {
    if (!alias || !password) {
      throw new Error("[Bad Request] No alias or password given");
    }

    const user = await this.userDao.getUserFromAlias(alias);
    if (!user) {
      throw new Error(`[Bad Request] User ${alias} doesn't exist`);
    }

    if (!(await this.userDao.verifyPassword(alias, password))) {
      throw new Error("[Bad Request] Incorrect password");
    }

    const authToken = AuthToken.Generate();
    await this.authDao.setAuth(alias, authToken.token, authToken.timestamp);
    return [user, authToken.dto];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageStringBase64: string,
    imageFileExtension: string
  ): Promise<[UserDto, AuthTokenDto]> {
    console.log("Entering userService.register()");
    const existingUser = await this.userDao.getUserFromAlias(alias);
    if (existingUser) {
      throw new Error("[Bad Request] User already exists");
    }

    const fileName = alias + imageFileExtension;
    const imageUrl = await this.fileDao.putImage(fileName, imageStringBase64);

    const user = new User(firstName, lastName, alias, imageUrl);
    const authToken = AuthToken.Generate();

    await this.userDao.createUser(firstName, lastName, alias, password, imageUrl);
    await this.authDao.setAuth(alias, authToken.token, authToken.timestamp);

    return [user.dto, authToken.dto];
  }

  public async logout(token: string): Promise<void> {
    console.log("Entering userService.logout()");
    await this.authDao.deleteAuth(token);
  }
}
