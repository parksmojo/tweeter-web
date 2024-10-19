import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { MessageView, Presenter } from "../Presenter";

export interface NavbarView extends MessageView {
  clearUserInfo: () => void;
}

export class NavbarPresenter extends Presenter<NavbarView> {
  private _userService: UserService;

  public constructor(view: NavbarView) {
    super(view);
    this._userService = new UserService();
  }

  public get userService() {
    return this._userService;
  }

  public async logOut(authToken: AuthToken) {
    this.view.displayInfoMessage("Logging Out...", 0);

    this.tryAction("log user out", async () => {
      await this.userService.logout(authToken!);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    });
  }
}
