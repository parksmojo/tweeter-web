import { FileDao } from "../file/FileDao";
import { FileDaoS3 } from "../file/FileDaoS3";
import { FollowDao } from "../follow/FollowDao";
import { FollowDaoDynamo } from "../follow/FollowDaoDynamo";
import { StatusDao } from "../status/StatusDao";
import { StatusDaoDynamo } from "../status/StatusDaoDynamo";
import { UserDao } from "../user/UserDao";
import { UserDaoDynamo } from "../user/UserDaoDynamo";
import { DaoFactory } from "./DaoFactory";

export class AwsDaoFactory implements DaoFactory {
  getFileDao(): FileDao {
    return new FileDaoS3();
  }
  getFollowDao(): FollowDao {
    return new FollowDaoDynamo();
  }
  getStatusDao(): StatusDao {
    return new StatusDaoDynamo();
  }
  getUserDao(): UserDao {
    return new UserDaoDynamo();
  }
}
