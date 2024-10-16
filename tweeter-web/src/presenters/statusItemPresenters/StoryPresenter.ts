import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE } from "../ItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(authToken!, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected getItemName(): string {
    return "story";
  }
}
