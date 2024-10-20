import "./PostStatus.css";
import { useState } from "react";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "../userInfo/UserInfoHook";
import { PostStatusPresenter, PostStatusView } from "../../presenters/statusItemPresenters/PostStatusPresenter";

interface Props {
  presenter?: PostStatusPresenter;
}

const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, clearLastInfoMessage } = useToastListener();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const checkButtonStatus = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const submitPost = (event: React.MouseEvent) => {
    event.preventDefault();
    presenter.submitPost(post, currentUser!, authToken!);
  };

  const listener: PostStatusView = {
    setIsLoading,
    displayInfoMessage,
    displayErrorMessage,
    setPost,
    clearLastInfoMessage,
  };
  const [presenter] = useState(props.presenter ?? new PostStatusPresenter(listener));

  return (
    <div className={isLoading ? "loading" : ""}>
      <form>
        <div className="form-group mb-3">
          <textarea
            className="form-control"
            id="postStatusTextArea"
            aria-label="Status"
            rows={10}
            placeholder="What's on your mind?"
            value={post}
            onChange={(event) => {
              setPost(event.target.value);
            }}
          />
        </div>
        <div className="form-group">
          <button
            id="postStatusButton"
            aria-label="Post"
            className="btn btn-md btn-primary me-1"
            type="button"
            disabled={checkButtonStatus()}
            style={{ width: "8em" }}
            onClick={submitPost}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <div>Post Status</div>
            )}
          </button>
          <button
            id="clearStatusButton"
            aria-label="Clear"
            className="btn btn-md btn-secondary"
            type="button"
            disabled={checkButtonStatus()}
            onClick={clearPost}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostStatus;
