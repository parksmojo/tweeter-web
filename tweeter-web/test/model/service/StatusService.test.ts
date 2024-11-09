import {
  AuthToken,
  GetFollowerCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  Status,
  User,
} from "tweeter-shared";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("ServerFacade", () => {
  let statusService: StatusService;
  let authToken: AuthToken;

  beforeEach(() => {
    statusService = new StatusService();
    authToken = new AuthToken("token", 100);
  });

  it("retrieves the story", async () => {
    const [statusList, hasMore] = await statusService.loadMoreStoryItems(authToken, "@alias", 10, null);
    expect(statusList).not.toBeNull();
    expect(statusList.length).not.toBe(0);
    expect(statusList.at(0)).toBeInstanceOf(Status);
    expect(hasMore).toBeTruthy();
  });
});
