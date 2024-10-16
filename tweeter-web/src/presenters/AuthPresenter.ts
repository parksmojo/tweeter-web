import { NavigateFunction } from "react-router-dom";
import { User, AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";
import { UserService } from "../model/service/UserService";

export interface AuthView extends View {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
  navigate: NavigateFunction;
}

export class AuthPresenter<V extends AuthView> extends Presenter<V> {
  private _userService: UserService;

  public constructor(view: V) {
    super(view);
    this._userService = new UserService();
  }

  protected get userService() {
    return this._userService;
  }

  protected async tryAuthAction(
    actionName: string,
    action: () => Promise<[User, AuthToken]>,
    rememberMe: boolean
  ): Promise<void> {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await action();

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      // do i still need to navigate to "/" here?
    } catch (error) {
      this.view.displayErrorMessage(`Failed to ${actionName} because of exception: ${error}`);
    } finally {
      this.view.setIsLoading(false);
    }
  }
}
