import { AuthPresenter, AuthView } from "../AuthPresenter";

export class LoginPresenter extends AuthPresenter<AuthView> {
  public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl: string) {
    await this.tryAuthAction("log user in", () => this.userService.login(alias, password), rememberMe);
  }
}
