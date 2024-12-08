import {
  AuthToken,
  GetFollowerCountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  Status,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../../src/network/ServerFacade";
import { StatusService } from "../../../src/model/service/StatusService";
import "isomorphic-fetch";

describe("ServerFacade", () => {
  let statusService: StatusService;
  let serverFacade: ServerFacade;
  let testAuth: AuthToken;
  let testUser: User;

  beforeEach(async () => {
    statusService = new StatusService();
    serverFacade = new ServerFacade();
    [testUser, testAuth] = await serverFacade.login({ alias: "@TestGuy1", password: "TestGuy1", token: "" });
  });

  it("retrieves the story", async () => {
    const [statusList, hasMore] = await statusService.loadMoreStoryItems(testAuth, testUser.alias, 10, null);
    expect(statusList).not.toBeNull();
    expect(statusList.length).toBe(0);
    expect(hasMore).toBeFalsy();
  });
});
