import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { MessageView, Presenter } from "../Presenter";

export interface UserInfoView extends MessageView {
  setIsFollower: (value: boolean) => void;
  setFolloweeCount: (value: number) => void;
  setFollowerCount: (value: number) => void;
  setDisplayedUser: (value: User) => void;
  setIsLoading: (value: boolean) => void;
}

export class UserInfoPresenter extends Presenter<UserInfoView> {
  private userService: UserService;

  public constructor(view: UserInfoView) {
    super(view);
    this.userService = new UserService();
  }

  public switchToLoggedInUser(event: React.MouseEvent, currentUser: User): void {
    event.preventDefault();
    this.view.setDisplayedUser(currentUser!);
  }

  public async setIsFollowerStatus(authToken: AuthToken, currentUser: User, displayedUser: User) {
    this.tryAction("determine follower status", async () => {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        this.view.setIsFollower(await this.userService.getIsFollowerStatus(authToken!, currentUser!, displayedUser!));
      }
    });
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    this.tryAction("get followees count", async () => {
      this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    });
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    this.tryAction("get followers count", async () => {
      this.view.setFolloweeCount(await this.userService.getFolloweeCount(authToken, displayedUser));
    });
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the follow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.userService.getFollowerCount(authToken, userToFollow);
    const followeeCount = await this.userService.getFolloweeCount(authToken, userToFollow);

    return [followerCount, followeeCount];
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    // Pause so we can see the unfollow message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));

    // TODO: Call the server

    const followerCount = await this.userService.getFollowerCount(authToken, userToUnfollow);
    const followeeCount = await this.userService.getFolloweeCount(authToken, userToUnfollow);

    return [followerCount, followeeCount];
  }

  public async followDisplayedUser(event: React.MouseEvent, displayedUser: User, authToken: AuthToken): Promise<void> {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.follow(authToken!, displayedUser!);

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to follow user because of exception: ${error}`);
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    event: React.MouseEvent,
    displayedUser: User,
    authToken: AuthToken
  ): Promise<void> {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${displayedUser!.name}...`, 0);

      const [followerCount, followeeCount] = await this.unfollow(authToken!, displayedUser!);

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to unfollow user because of exception: ${error}`);
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
