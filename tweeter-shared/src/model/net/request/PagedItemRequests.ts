import { StatusDto } from "../../dto/StatusDto";
import { UserDto } from "../../dto/UserDto";
import { TweeterRequest } from "./TweeterRequest";

export interface PagedItemRequest extends TweeterRequest {
  readonly userAlias: string;
  readonly pageSize: number;
}

export interface PagedUserItemRequest extends PagedItemRequest {
  readonly lastItem: UserDto | null;
}

export interface PagedStatusItemRequest extends PagedItemRequest {
  readonly lastItem: StatusDto | null;
}
