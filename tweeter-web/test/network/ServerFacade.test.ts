import { AuthToken, GetFollowerCountRequest, PagedUserItemRequest, RegisterRequest, User } from "tweeter-shared";
import { ServerFacade } from "../../src/network/ServerFacade";
import "isomorphic-fetch";

describe("ServerFacade", () => {
  let serverFacade: ServerFacade;
  let testUser: User;
  let testAuth: AuthToken;

  const FIRST_NAME = "TestFirstName";
  const LAST_NAME = "TestLastName";
  const ALIAS = "TestAlias";
  const PASSWORD = "TestPassword";
  const IMAGE_URL = "https://parker340bucket.s3.us-west-2.amazonaws.com/image/@TestGuy1png";

  beforeAll(() => {
    const rand = Math.floor(Math.random() * 1000000);
    testUser = new User(FIRST_NAME + rand, LAST_NAME + rand, ALIAS + rand, IMAGE_URL);
  });

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  it("allows registering", async () => {
    const request: RegisterRequest = {
      token: "",
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      alias: testUser.alias,
      password: PASSWORD,
      imageStringBase64: "imageStringBase64",
      imageFileExtension: "imageFileExtension",
    };
    const [user, authToken] = await serverFacade.register(request);
    expect(user).not.toBeNull();
    expect(user).toBeInstanceOf(User);
    expect(authToken).not.toBeNull();
    expect(authToken).toBeInstanceOf(AuthToken);
    testAuth = authToken;
  }, 10000);

  it("gets followers", async () => {
    const request: PagedUserItemRequest = {
      token: testAuth.token,
      userAlias: testUser.alias,
      pageSize: 10,
      lastItem: null,
    };
    const [users, hasMore] = await serverFacade.getMoreFollowers(request);
    expect(users).not.toBeNull();
    expect(users.length).toBe(0);
    expect(hasMore).toBeFalsy();
  });

  it("gets followers count", async () => {
    const request: GetFollowerCountRequest = {
      token: testAuth.token,
      user: testUser.dto,
    };
    const count = await serverFacade.getFollowCount("follower", request);
    expect(count).toBe(0);
  });
});
