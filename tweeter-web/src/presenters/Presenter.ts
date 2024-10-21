export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
}

export abstract class Presenter<V extends View> {
  private _view: V;

  protected constructor(view: V) {
    this._view = view;
  }

  protected get view(): V {
    return this._view;
  }

  public async tryAction(actionName: string, action: () => Promise<void>): Promise<void> {
    try {
      await action();
    } catch (error) {
      this.view.displayErrorMessage(`Failed to ${actionName} because of exception: ${(error as Error).message}`);
    }
  }
}
