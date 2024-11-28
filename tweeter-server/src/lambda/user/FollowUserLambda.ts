import { GetIsFollowerRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async (request: GetIsFollowerRequest): Promise<TweeterResponse> => {
  const userService = new UserService(new AwsDaoFactory());
  await userService.followUser(request.token, request.selectedUser);
  return {
    success: true,
    message: null,
  };
};
