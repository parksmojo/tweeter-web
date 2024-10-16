import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { Presenter, View } from "../Presenter";

export interface UserNavigationView extends View {
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter extends Presenter<UserNavigationView> {
  private userService: UserService;

  public constructor(view: UserNavigationView) {
    super(view);
    this.userService = new UserService();
  }

  public async navigateToUser(event: React.MouseEvent, authToken: AuthToken, currentUser: User): Promise<void> {
    event.preventDefault();
    this.tryAction("get user", async () => {
      const alias = await this.userService.extractAlias(event.target.toString());

      const user = await this.userService.getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          this.view.setDisplayedUser(currentUser!);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    });
  }
}
