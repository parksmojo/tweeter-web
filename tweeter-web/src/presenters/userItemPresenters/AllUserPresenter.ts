import { AuthToken, User } from "tweeter-shared";
import { ItemPresenter, PAGE_SIZE } from "../ItemPresenter";
import { UserService } from "../../model/service/UserService";

export class AllUserPresenter extends ItemPresenter<User, UserService> {
  protected createService(): UserService {
    return new UserService();
  }

  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    return this.service.loadMoreUsers(authToken!, PAGE_SIZE, this.lastItem);
  }

  protected getItemName(): string {
    return "user";
  }
}
