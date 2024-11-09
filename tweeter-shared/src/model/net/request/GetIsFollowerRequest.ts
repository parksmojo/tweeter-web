import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface GetIsFollowerRequest extends TweeterRequest {
  user: UserDto;
  selectedUser: UserDto;
}
