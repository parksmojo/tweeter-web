import { GetIsFollowerRequest, GetIsFollowerResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async (request: GetIsFollowerRequest): Promise<GetIsFollowerResponse> => {
  const userService = new UserService(new AwsDaoFactory());
  const isFollower = await userService.getIsFollowerStatus(request.token, request.user, request.selectedUser);
  return {
    success: true,
    message: null,
    isFollower: isFollower,
  };
};
