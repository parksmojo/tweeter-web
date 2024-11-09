import {
  GetFollowerCountRequest,
  GetFollowerCountResponse,
  GetIsFollowerRequest,
  GetIsFollowerResponse,
  GetUserRequest,
  GetUserResponse,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse,
  PostStatusRequest,
  Status,
  StatusDto,
  TweeterResponse,
  User,
  UserDto,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL = "https://ys3nvfi53m.execute-api.us-west-2.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    return await this.getMoreUserItems("followee", request);
  }

  public async getMoreFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    return await this.getMoreUserItems("follower", request);
  }

  private async getMoreUserItems(userType: string, request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedUserItemRequest, PagedUserItemResponse>(
      request,
      `/${userType}/list`
    );

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items ? response.items.map((dto: UserDto) => User.fromDto(dto) as User) : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${userType}s found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getMoreFeed(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
    return await this.getMoreStatusItems("feed", request);
  }

  public async getMoreStory(request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
    return await this.getMoreStatusItems("story", request);
  }

  private async getMoreStatusItems(statusType: string, request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<PagedStatusItemRequest, PagedStatusItemResponse>(
      request,
      `/${statusType}/list`
    );

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: Status[] | null =
      response.success && response.items ? response.items.map((dto: StatusDto) => Status.fromDto(dto) as Status) : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No ${statusType}s found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    console.log("Server posting status");
    const response = await this.clientCommunicator.doPost<PostStatusRequest, TweeterResponse>(request, `/story/post`);

    // Handle errors
    if (!response.success) {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getUser(request: GetUserRequest): Promise<User> {
    const response = await this.clientCommunicator.doPost<GetUserRequest, GetUserResponse>(request, `/user/find`);

    // Handle errors
    if (response.success) {
      return User.fromDto(response.user)!;
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getIsFollower(request: GetIsFollowerRequest): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<GetIsFollowerRequest, GetIsFollowerResponse>(
      request,
      `/user/isfollower`
    );

    if (response.success) {
      return response.isFollower;
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }

  public async getFollowCount(followType: string, request: GetFollowerCountRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<GetFollowerCountRequest, GetFollowerCountResponse>(
      request,
      `/user/${followType}/count`
    );

    if (response.success) {
      return response.count;
    } else {
      console.error(response);
      throw new Error(response.message!);
    }
  }
}
