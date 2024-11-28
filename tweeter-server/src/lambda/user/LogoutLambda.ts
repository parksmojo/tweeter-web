import { TweeterRequest, TweeterResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async (request: TweeterRequest): Promise<TweeterResponse> => {
  console.log("Entering LogoutLambda");
  const userService = new UserService(new AwsDaoFactory());
  await userService.logout(request.token);
  return {
    success: true,
    message: null,
  };
};
