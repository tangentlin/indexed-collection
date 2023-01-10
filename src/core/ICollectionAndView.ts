import { ISignalObserver } from '../signals/ISignalObserver';

export interface ICollectionAndView<T> extends ISignalObserver {
  readonly items: readonly T[];

  rebuild(deep?: boolean): void;

  exists(item: T): boolean;
}
