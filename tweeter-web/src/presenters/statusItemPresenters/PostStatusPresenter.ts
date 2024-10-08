import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export interface PostStatusView {
  setIsLoading: (value: boolean) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  displayErrorMessage: (message: string) => void;
  setPost: (message: string) => void;
  clearLastInfoMessage: () => void;
}

export class PostStatusPresenter {
  private _view: PostStatusView;
  private statusService: StatusService;

  public constructor(view: PostStatusView) {
    this._view = view;
    this.statusService = new StatusService();
  }

  public async submitPost(event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
    event.preventDefault();

    try {
      this._view.setIsLoading(true);
      this._view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser!, Date.now());

      await this.statusService.postStatus(authToken!, status);

      this._view.setPost("");
      this._view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this._view.displayErrorMessage(`Failed to post the status because of exception: ${error}`);
    } finally {
      this._view.clearLastInfoMessage();
      this._view.setIsLoading(false);
    }
  }

  public clearPost(event: React.MouseEvent) {
    event.preventDefault();
    this._view.setPost("");
  }

  public checkButtonStatus(post: string, authToken: AuthToken, currentUser: User): boolean {
    return !post.trim() || !authToken || !currentUser;
  }
}
