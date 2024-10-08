import { useContext } from "react";
import { UserInfoContext } from "./UserInfoProvider";
import { User, AuthToken } from "tweeter-shared";

interface UserInfo {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
  clearUserInfo: () => void;
  setDisplayedUser: (user: User) => void;
}

const useUserInfo = (): UserInfo => useContext(UserInfoContext);

export default useUserInfo;
