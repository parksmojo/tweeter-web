import { AuthToken } from "tweeter-shared";
import { NavbarPresenter, NavbarView } from "../../../src/presenters/userItemPresenters/NavbarPresenter";
import { anything, instance, mock, spy, verify, when } from "ts-mockito";
import { UserService } from "../../../src/model/service/UserService";

describe("NavbarPresenter", () => {
  let navbarPresenter: NavbarPresenter;
  let mockNavbarView: NavbarView;
  let mockUserService: UserService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(() => {
    mockNavbarView = mock<NavbarView>();
    const mockNavbarViewInstance = instance(mockNavbarView);

    const navbarPresenterSpy = spy(new NavbarPresenter(mockNavbarViewInstance));
    navbarPresenter = instance(navbarPresenterSpy);

    mockUserService = mock<UserService>();
    const mockUserServiceInstance = instance(mockUserService);

    when(navbarPresenterSpy.userService).thenReturn(mockUserServiceInstance);
  });

  it("tells the view to display a logging out message", async () => {
    await navbarPresenter.logOut(authToken);
    verify(mockNavbarView.displayInfoMessage("Logging Out...", 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await navbarPresenter.logOut(authToken);
    verify(mockUserService.logout(authToken)).once();
  });

  it("tells the view to clear last info message and user info when logout successful", async () => {
    await navbarPresenter.logOut(authToken);
    verify(mockNavbarView.displayErrorMessage(anything())).never();
    verify(mockNavbarView.clearLastInfoMessage()).once();
    verify(mockNavbarView.clearUserInfo()).once();
  });

  it("tells the view to display an error message and does not clear the last info message or user info when logout unsuccessful", async () => {
    const error = new Error("An error occurred");
    when(mockUserService.logout(authToken)).thenThrow(error);

    await navbarPresenter.logOut(authToken);
    verify(mockNavbarView.displayErrorMessage("Failed to log user out because of exception: An error occurred")).once();
    verify(mockNavbarView.clearLastInfoMessage()).never();
    verify(mockNavbarView.clearUserInfo()).never();
  });
});
