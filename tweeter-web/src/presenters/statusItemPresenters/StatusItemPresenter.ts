import { Status } from "tweeter-shared";
import { ItemPresenter } from "../ItemPresenter";
import { StatusService } from "../../model/service/StatusService";

export abstract class StatusItemPresenter extends ItemPresenter<Status, StatusService> {
  protected createService(): StatusService {
    return new StatusService();
  }
}
