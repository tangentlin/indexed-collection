import { CollectionViewFilterFn } from './CollectionViewFilterFn';

export interface ICollectionViewOption<T> {
  filter: CollectionViewFilterFn<T>;
  sort: (a: T, b: T) => number;
}
