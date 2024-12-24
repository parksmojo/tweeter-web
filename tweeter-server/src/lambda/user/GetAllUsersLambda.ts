import { PagedUserItemRequest, PagedUserItemResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async (request: PagedUserItemRequest): Promise<PagedUserItemResponse> => {
  const userService = new UserService(new AwsDaoFactory());
  const [items, hasMore] = await userService.getAllUsers(request.token, request.pageSize, request.lastItem);

  return {
    success: true,
    message: null,
    items: items,
    hasMore: hasMore,
  };
};
