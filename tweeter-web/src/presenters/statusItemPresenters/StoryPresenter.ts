import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";
import { StatusService } from "../../model/service/StatusService";
import { PAGE_SIZE } from "../ItemPresenter";

export class StoryPresenter extends StatusItemPresenter {
  protected getMoreItems(authToken: AuthToken, userAlias: string): Promise<[Status[], boolean]> {
    return this.service.loadMoreStoryItems(authToken!, userAlias, PAGE_SIZE, this.lastItem);
  }

  protected getItemName(): string {
    return "story";
  }
}
