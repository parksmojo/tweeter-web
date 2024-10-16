import { AuthToken, Status } from "tweeter-shared";
import { Presenter, View } from "../Presenter";
import { ItemPresenter } from "../ItemPresenter";
import { StatusService } from "../../model/service/StatusService";

export interface StatusItemView extends View {
  addItems: (newItems: Status[]) => void;
}

export abstract class StatusItemPresenter extends ItemPresenter<Status, StatusService> {
  protected createService(): StatusService {
    return new StatusService();
  }
}
