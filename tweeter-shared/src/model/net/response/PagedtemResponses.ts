import { StatusDto } from "../../dto/StatusDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterResponse } from "./TweeterResponse";

export interface PagedItemResponse extends TweeterResponse {
  readonly hasMore: boolean;
}

export interface PagedUserItemResponse extends PagedItemResponse {
  readonly items: UserDto[] | null;
}

export interface PagedStatusItemResponse extends PagedItemResponse {
  readonly items: StatusDto[] | null;
}
