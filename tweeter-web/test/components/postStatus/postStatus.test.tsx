import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import React from "react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { instance, mock, verify } from "ts-mockito";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { PostStatusPresenter } from "../../../src/presenters/statusItemPresenters/PostStatusPresenter";
import { AuthToken, User } from "tweeter-shared";
import useUserInfo from "../../../src/components/userInfo/UserInfoHook";

jest.mock("../../../src/components/userInfo/UserInfoHook", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHook"),
  __esModule: true,
  default: jest.fn(),
}));

describe("Post Status Component", () => {
  let mockUserInstance: User;
  let mockAuthTokenInstance: AuthToken;

  beforeAll(() => {
    let mockUser = mock<User>();
    mockUserInstance = instance(mockUser);

    let mockAuthToken = mock<AuthToken>();
    mockAuthTokenInstance = instance(mockAuthToken);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });

  test("When first rendered the Post Status and Clear buttons are both disabled", () => {
    const { postButton, clearButton } = renderPostStatusAndGetElements();
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  test("Both buttons are enabled when the text field has text", async () => {
    const { postButton, clearButton, user, statusField } = renderPostStatusAndGetElements();
    await user.type(statusField, "Hello World");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });

  test("Both buttons are disabled when the text field is cleared", async () => {
    const { postButton, clearButton, user, statusField } = renderPostStatusAndGetElements();
    await user.type(statusField, "Hello World");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
    await user.clear(statusField);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
    await user.type(statusField, "Hello World");
    expect(postButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
    await user.click(clearButton);
    expect(postButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });

  test("The presenter's postStatus method is called with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);
    const post = "Please work";

    const { postButton, user, statusField } = renderPostStatusAndGetElements(mockPresenterInstance);

    await user.type(statusField, post);
    await user.click(postButton);
    verify(mockPresenter.submitPost(post, mockUserInstance, mockAuthTokenInstance)).once();
  });
});

const renderPostStatus = (presenter?: PostStatusPresenter) => {
  return render(
    <MemoryRouter>
      <PostStatus presenter={presenter} />
    </MemoryRouter>
  );
};

const renderPostStatusAndGetElements = (presenter?: PostStatusPresenter) => {
  const user = userEvent.setup();
  renderPostStatus(presenter);

  const postButton = screen.getByLabelText("Post");
  const clearButton = screen.getByLabelText("Clear");
  const statusField = screen.getByLabelText("Status");

  return { user, postButton, clearButton, statusField };
};
