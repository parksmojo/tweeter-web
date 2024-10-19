import { mock, instance, spy, when, anything, verify, capture } from "ts-mockito";
import { UserService } from "../../../src/model/service/UserService";
import { PostStatusPresenter, PostStatusView } from "../../../src/presenters/statusItemPresenters/PostStatusPresenter";
import { NavbarView, NavbarPresenter } from "../../../src/presenters/userItemPresenters/NavbarPresenter";
import { StatusService } from "../../../src/model/service/StatusService";
import { AuthToken, Status, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusView: PostStatusView;
  let mockStatusService: StatusService;

  const authToken = new AuthToken("abc123", Date.now());
  const user = new User("John", "Doe", "john123", anything());
  const post = "Hello World!";
  const status = new Status(post, user, anything());

  beforeEach(() => {
    mockPostStatusView = mock<PostStatusView>();
    const mockPostStatusViewInstance = instance(mockPostStatusView);

    const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
    postStatusPresenter = instance(postStatusPresenterSpy);

    mockStatusService = mock<StatusService>();
    const mockStatusServiceInstance = instance(mockStatusService);

    when(postStatusPresenterSpy.statusService).thenReturn(mockStatusServiceInstance);
  });

  it("tells view to display a posting status message", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);
    verify(mockPostStatusView.displayInfoMessage("Posting status...", 0)).once();
  });

  it("calls status service's postStatus with correct status string and auth token", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);
    const [capturedAuthToken, capturedStatus] = capture(mockStatusService.postStatus).last();
    expect(capturedStatus.post).toBe(post);
  });

  it("tells view to clear last info message and post, and display a status posted message, when post successful", async () => {
    await postStatusPresenter.submitPost(post, user, authToken);
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).once();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000));
  });

  it("tells view to display an error message and clear last info message and does not tell it to clear post or display a status posted message", async () => {
    const error = new Error("An error occurred");
    when(mockStatusService.postStatus(authToken, anything())).thenThrow(error);

    await postStatusPresenter.submitPost(post, user, authToken);
    verify(
      mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: An error occurred")
    ).once();
    verify(mockPostStatusView.clearLastInfoMessage()).once();
    verify(mockPostStatusView.setPost("")).never();
    verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000)).never();
  });
});
