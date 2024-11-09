import { TweeterResponse } from "./TweeterResponse";

export interface GetIsFollowerResponse extends TweeterResponse {
  isFollower: boolean;
}
