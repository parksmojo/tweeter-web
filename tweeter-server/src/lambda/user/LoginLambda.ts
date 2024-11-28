import { LoginRequest, SessionResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async (request: LoginRequest): Promise<SessionResponse> => {
  const userService = new UserService(new AwsDaoFactory());
  const [userDto, authTokenDto] = await userService.login(request.alias, request.password);
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authTokenDto,
  };
};
