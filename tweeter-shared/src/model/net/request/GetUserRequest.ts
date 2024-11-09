import { TweeterRequest } from "./TweeterRequest";

export interface GetUserRequest extends TweeterRequest {
  alias: string;
}
