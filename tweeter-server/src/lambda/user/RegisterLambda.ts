import { RegisterRequest, SessionResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async (request: RegisterRequest): Promise<SessionResponse> => {
  console.log("Entering RegisterLambda");
  const userService = new UserService(new AwsDaoFactory());
  const [userDto, authTokenDto] = await userService.register(
    request.firstName,
    request.lastName,
    request.alias,
    request.password,
    request.imageStringBase64,
    request.imageFileExtension
  );
  console.log("Leaving RegisterLambda");
  return {
    success: true,
    message: null,
    user: userDto,
    authToken: authTokenDto,
  };
};
