import { GetFollowerCountRequest, GetFollowerCountResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async (request: GetFollowerCountRequest): Promise<GetFollowerCountResponse> => {
  const userService = new UserService(new AwsDaoFactory());
  const count = await userService.getFollowerCount(request.token, request.user);
  return {
    success: true,
    message: null,
    count: count,
  };
};
