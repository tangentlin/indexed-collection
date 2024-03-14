export interface ICollectionUpdateLineItem<T> {
  oldValue: T;
  newValue: T;
}

export interface ICollectionChangeDetail<T> {
  readonly added: T[];
  readonly removed: T[];
  readonly updated: ICollectionUpdateLineItem<T>[];
}
