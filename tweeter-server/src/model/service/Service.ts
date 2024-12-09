import { AuthDao } from "../../dao/auth/AuthDao";
import { DaoFactory } from "../../dao/factory/DaoFactory";

export abstract class Service {
  protected authDao: AuthDao;
  private readonly authLifespan: number = 600000;

  constructor(daoFactory: DaoFactory) {
    this.authDao = daoFactory.getAuthDao();
  }

  protected async verifyAuth(token: string): Promise<void> {
    console.log("Verifying authToken");
    const authToken = await this.authDao.getAuth(token);
    if (!authToken) {
      throw new Error("[Bad Request] Token not found");
    }

    const now = Date.now();
    const difference = now - authToken?.timestamp;
    console.log(` - Time difference: ${difference / 60000} minutes`);

    if (difference > this.authLifespan) {
      throw new Error("[Bad Request] Token expired");
    }
    await this.authDao.updateAuth(token, now);
  }
}
