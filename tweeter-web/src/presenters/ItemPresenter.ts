import { AuthToken } from "tweeter-shared";
import { Presenter, View } from "./Presenter";

export const PAGE_SIZE = 10;

export interface ItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class ItemPresenter<T, S> extends Presenter<ItemView<T>> {
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private _service: S;

  constructor(view: ItemView<T>) {
    super(view);
    this._service = this.createService();
  }

  protected get service(): S {
    return this._service;
  }

  protected abstract createService(): S;

  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem() {
    return this._lastItem;
  }
  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }

  reset() {
    this.lastItem = null;
    this._hasMoreItems = true;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    this.tryAction(`load ${this.getItemName()} items`, async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken!, userAlias);

      this.hasMoreItems = hasMore;
      this.lastItem = newItems[newItems.length - 1];
      this.view.addItems(newItems);
    });
  }

  protected abstract getMoreItems(authToken: AuthToken, userAlias: string): Promise<[T[], boolean]>;

  protected abstract getItemName(): string;
}
