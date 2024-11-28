import { GetUserRequest, GetUserResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async (request: GetUserRequest): Promise<GetUserResponse> => {
  const userService = new UserService(new AwsDaoFactory());
  const userDto = await userService.getUser(request.token, request.alias);

  return {
    success: true,
    message: null,
    user: userDto,
  };
};
