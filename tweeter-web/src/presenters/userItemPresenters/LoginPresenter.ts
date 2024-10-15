import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { NavigateFunction } from "react-router-dom";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
  navigate: NavigateFunction;
}

export class LoginPresenter {
  private _view: LoginView;
  private userService: UserService;

  public constructor(view: LoginView) {
    this._view = view;
    this.userService = new UserService();
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(alias, password);

      this._view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this._view.navigate(originalUrl);
      } else {
        this._view.navigate("/");
      }
    } catch (error) {
      this._view.displayErrorMessage(`Failed to log user in because of exception: ${error}`);
    } finally {
      this._view.setIsLoading(false);
    }
  }
}
