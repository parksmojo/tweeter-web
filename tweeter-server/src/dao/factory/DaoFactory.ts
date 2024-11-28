import { AuthDao } from "../auth/AuthDao";
import { FileDao } from "../file/FileDao";
import { FollowDao } from "../follow/FollowDao";
import { StatusDao } from "../status/StatusDao";
import { UserDao } from "../user/UserDao";

export interface DaoFactory {
  getFileDao(): FileDao;
  getFollowDao(): FollowDao;
  getStatusDao(): StatusDao;
  getUserDao(): UserDao;
  getAuthDao(): AuthDao;
}
