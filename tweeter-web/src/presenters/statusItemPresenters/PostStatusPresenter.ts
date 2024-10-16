import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { MessageView, Presenter } from "../Presenter";

export interface PostStatusView extends MessageView {
  setIsLoading: (value: boolean) => void;
  setPost: (message: string) => void;
}

export class PostStatusPresenter extends Presenter<PostStatusView> {
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    super(view);
    this.statusService = new StatusService();
  }

  public async submitPost(event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
    event.preventDefault();

    try {
      this.view.setIsLoading(true);
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this.view.setPost("");
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setIsLoading(false);
    }
  }
}
