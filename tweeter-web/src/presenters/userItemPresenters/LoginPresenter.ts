import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { NavigateFunction } from "react-router-dom";
import { Presenter, View } from "../Presenter";

export interface LoginView extends View {
  setIsLoading: (value: boolean) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
  navigate: NavigateFunction;
}

export class LoginPresenter extends Presenter<LoginView> {
  private userService: UserService;

  public constructor(view: LoginView) {
    super(view);
    this.userService = new UserService();
  }

  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string) {
    this.tryAction("log user in", async () => {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.userService.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (!!originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate("/");
      }
    });
  }
}
