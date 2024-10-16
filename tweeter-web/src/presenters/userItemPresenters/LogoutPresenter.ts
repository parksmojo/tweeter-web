import { AuthToken } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { MessageView, Presenter } from "../Presenter";

export interface LogoutView extends MessageView {
  clearUserInfo: () => void;
}

export class LogoutPresenter extends Presenter<LogoutView> {
  private userService: UserService;

  public constructor(view: LogoutView) {
    super(view);
    this.userService = new UserService();
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
