import { GetIsFollowerRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: GetIsFollowerRequest): Promise<TweeterResponse> => {
  const userService = new UserService();
  await userService.unfollowUser(request.token, request.selectedUser);
  return {
    success: true,
    message: null,
  };
};
