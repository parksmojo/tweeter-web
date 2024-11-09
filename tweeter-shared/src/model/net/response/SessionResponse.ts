import { AuthTokenDto } from "../../dto/AuthTokenDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface SessionResponse extends TweeterResponse {
  user: UserDto;
  authToken: AuthTokenDto;
}
