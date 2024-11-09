import { RegisterRequest, SessionResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";

export const handler = async (request: RegisterRequest): Promise<SessionResponse> => {
  const userService = new UserService();
  const [userDto, authTokenDto] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.imageStringBase64,
    request.imageFileExtension
  );
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authTokenDto,
  };
};