import { AuthToken, User } from "tweeter-shared";
import { UserItemPresenter } from "./UserItemPresenter";
import { PAGE_SIZE } from "../ItemPresenter";

export class FolloweePresenter extends UserItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(authToken!, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected getItemName(): string {
    return "followee";
  }
}
