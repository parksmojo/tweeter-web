import { StatusDto } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { AwsDaoFactory } from "../../dao/factory/AwsDaoFactory";

export const handler = async function (event: any) {
  const statusService = new StatusService(new AwsDaoFactory());
  for (let i = 0; i < event.Records.length; ++i) {
    const { body } = event.Records[i];
    const status: StatusDto = JSON.parse(body);
    await statusService.makeFeedJobAssignments(status);
  }
  return {
    success: true,
    message: null,
  };
};
