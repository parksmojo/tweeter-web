import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async function (event: any) {
  const statusService = new StatusService(new AwsDaoFactory());
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const { status, followers } = JSON.parse(body);
    await statusService.updateFeeds(status, followers);
  }
  return {
    success: true,
    message: null,
  };
};
