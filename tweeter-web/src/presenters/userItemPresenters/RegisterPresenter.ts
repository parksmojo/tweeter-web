import { To, NavigateOptions } from "react-router-dom";
import { UserService } from "../../model/service/UserService";
import { User, AuthToken } from "tweeter-shared";
import { Buffer } from "buffer";

export interface RegisterView {
  setIsLoading: (value: boolean) => void;
  displayErrorMessage: (message: string) => void;
  navigate: (to: To, options?: NavigateOptions) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
  setImageUrl: (value: string) => void;
  setImageBytes: (value: Uint8Array) => void;
  setImageFileExtension: (value: string) => void;
}

export class RegisterPresenter {
  private _view: RegisterView;
  private userService: UserService;

  public constructor(view: RegisterView) {
    this._view = view;
    this.userService = new UserService();
  }

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageFileExtension: string
  ): boolean {
    return !firstName || !lastName || !alias || !password || !imageUrl || !imageFileExtension;
  }

  public registerOnEnter(
    event: React.KeyboardEvent<HTMLElement>,
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    if (
      event.key == "Enter" &&
      !this.checkSubmitButtonStatus(firstName, lastName, alias, password, imageUrl, imageFileExtension)
    ) {
      this.doRegister(firstName, lastName, alias, password, imageBytes, imageFileExtension, rememberMe);
    }
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    imageFileExtension: string,
    rememberMe: boolean
  ) {
    try {
      this._view.setIsLoading(true);

      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this._view.updateUserInfo(user, user, authToken, rememberMe);
      this._view.navigate("/");
    } catch (error) {
      this._view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
    } finally {
      this._view.setIsLoading(false);
    }
  }

  public handleImageFile(file: File | undefined) {
    if (file) {
      this._view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents = imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(imageStringBase64BufferContents, "base64");

        this._view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this._view.setImageFileExtension(fileExtension);
      }
    } else {
      this._view.setImageUrl("");
      this._view.setImageBytes(new Uint8Array());
    }
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
