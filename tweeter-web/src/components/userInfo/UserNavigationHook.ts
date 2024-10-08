import useToastListener from "../toaster/ToastListenerHook";
import useUserInfo from "./UserInfoHook";
import { useState } from "react";
import {
  UserNavigationPresenter,
  UserNavigationView,
} from "../../presenters/hookPresenters/UserNavigationHookPresenter";

interface Navigation {
  navigateToUser: (event: React.MouseEvent) => Promise<void>;
}

const useUserNavigation = (): Navigation => {
  const { displayErrorMessage } = useToastListener();
  const { setDisplayedUser, currentUser, authToken } = useUserInfo();

  const listener: UserNavigationView = {
    setDisplayedUser,
    displayErrorMessage,
  };

  const [presenter] = useState(new UserNavigationPresenter(listener));

  return {
    navigateToUser: (event: React.MouseEvent) => presenter.navigateToUser(event, authToken!, currentUser!),
  };
};

export default useUserNavigation;
