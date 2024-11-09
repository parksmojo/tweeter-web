import { AuthToken, GetFollowerCountRequest, PagedUserItemRequest, RegisterRequest, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade", () => {
  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it("allows registering", async () => {
    const request: RegisterRequest = {
      token: "",
      firstName: "firstName",
      lastName: "lastName",
      alias: "alias",
      password: "password",
      imageStringBase64: "imageStringBase64",
      imageFileExtension: "imageFileExtension",
    };
    const [user, authToken] = await serverFacade.register(request);
    expect(user).not.toBeNull();
    expect(user).toBeInstanceOf(User);
    expect(authToken).not.toBeNull();
    expect(authToken).toBeInstanceOf(AuthToken);
  });

  it("gets followers", async () => {
    const request: PagedUserItemRequest = {
      token: "token",
      userAlias: "userAlias",
      pageSize: 10,
      lastItem: null,
    };
    const [user, hasMore] = await serverFacade.getMoreFollowers(request);
    expect(user).not.toBeNull();
    expect(user.length).not.toBe(0);
    expect(user.at(0)).toBeInstanceOf(User);
    expect(hasMore).toBeTruthy();
  });

  it("gets followers count", async () => {
    const request: GetFollowerCountRequest = {
      token: "token",
      user: new User("first", "last", "alias", "image").dto,
    };
    const count = await serverFacade.getFollowCount("follower", request);
    expect(count).not.toBe(0);
  });
});
