import { ICollectionViewOption } from './ICollectionViewOption';

export const defaultFilter = () => true;
export const defaultSort = () => 0;
export const defaultCollectionViewOption: ICollectionViewOption<any> = Object.freeze({
  filter: defaultFilter,
  sort: defaultSort,
});
