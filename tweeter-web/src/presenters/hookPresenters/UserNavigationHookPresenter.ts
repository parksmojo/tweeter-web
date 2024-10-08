import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import useUserInfo from "../../components/userInfo/UserInfoHook";

export interface UserNavigationView {
  setDisplayedUser: (user: User) => void;
  displayErrorMessage: (message: string) => void;
}

export class UserNavigationPresenter {
  private _view: UserNavigationView;
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    this._view = view;
    this.userService = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User): Promise<void> {
    event.preventDefault();

    try {
      const alias = await this.userService.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this._view.setDisplayedUser(currentUser!);
        } else {
          this._view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this._view.displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  }
}
