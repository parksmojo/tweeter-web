import { AuthToken, User, FakeData, UserDto, AuthTokenDto } from "tweeter-shared";
import { FileDao } from "../../dao/file/FileDao";
import { UserDao } from "../../dao/user/UserDao";
import { DaoFactory } from "../../dao/factory/DaoFactory";
import { Service } from "./Service";

export class UserService extends Service {
  private fileDao: FileDao;
  private userDao: UserDao;

  constructor(daoFactory: DaoFactory) {
    super(daoFactory);
    this.fileDao = daoFactory.getFileDao();
    this.userDao = daoFactory.getUserDao();
  }

  public async getUser(token: string, alias: string): Promise<UserDto> {
    this.verifyAuth(token);
    const dto = (await this.userDao.getUserFromAlias(alias))?.dto;
    if (!dto) {
      throw new Error("[Bad Request] User not found");
    }
    return dto;
  }

  public async followUser(token: string, selectedUser: UserDto): Promise<void> {
    console.log(`Following user: ${selectedUser}`);
  }

  public async unfollowUser(token: string, selectedUser: UserDto): Promise<void> {
    console.log(`Unollowing user: ${selectedUser}`);
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
    if (!alias || !password) {
      throw new Error("[Bad Request] No alias or password given");
    }

    const user = await this.userDao.getUserFromAlias(alias);
    if (!user) {
      throw new Error("[Bad Request] User doesn't exist");
    }

    if (!(await this.userDao.verifyPassword(alias, password))) {
      throw new Error("[Bad Request] Incorrect password");
    }

    const authToken = AuthToken.Generate();
    await this.authDao.setAuth(alias, authToken.token, authToken.timestamp);
    return [user.dto, authToken.dto];
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
