import { AuthToken, FakeData, Status, User, Type } from "tweeter-shared";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoProvider";
import useToastListener from "../toaster/ToastListenerHook";
import useUserNavigation from "../userInfo/UserNavigationHook";

interface Props {
  status: Status;
}

const Post = (props: Props) => {
  const { setDisplayedUser, currentUser, authToken } = useContext(UserInfoContext);
  const { displayErrorMessage } = useToastListener();
  const { navigateToUser } = useUserNavigation();

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link key={index} to={segment.text} onClick={(event) => navigateToUser(event)}>
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a key={index} href={segment.text} target="_blank" rel="noopener noreferrer">
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
