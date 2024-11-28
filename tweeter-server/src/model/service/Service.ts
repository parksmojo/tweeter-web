import { AuthDao } from "../../dao/auth/AuthDao";
import { DaoFactory } from "../../dao/factory/DaoFactory";

export abstract class Service {
  protected authDao: AuthDao;
  private readonly authLifespan: number = 30000;

  constructor(daoFactory: DaoFactory) {
    this.authDao = daoFactory.getAuthDao();
  }

  protected async verifyAuth(token: string): Promise<void> {
    const authToken = await this.authDao.getAuth(token);
    if (!authToken) {
      throw new Error("[Bad Request] Token not found");
    }
    const now = Date.now();
    if (now - authToken?.timestamp < this.authLifespan) {
      throw new Error("[Bad Request] Token expired");
    }
    await this.authDao.updateAuth(token);
  }
}
