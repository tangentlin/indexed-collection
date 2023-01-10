import { IReadonlyCollection } from './IReadonlyCollection';

export interface IMutableCollection<T> extends IReadonlyCollection<T> {
  add(item: T): boolean;

  addRange(items: readonly T[] | IReadonlyCollection<T>): boolean[];

  remove(item: T): boolean;
}
