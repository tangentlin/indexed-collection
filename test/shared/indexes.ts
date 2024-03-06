import {
  CollectionIndex,
  ICollectionOption,
  MultipleKeyExtract,
  buildMultipleKeyExtract,
} from '../../src';
import { AttributeTag, ICar } from './data';

export const PriceRangeName = {
  under10k: 'Under 10k',
  '10k': '10-19k',
  '20k': '20-29k',
  '30k': '30-39k',
  '40k': '40-49k',
  over50k: '50k+',
};
export const getByMakeIndex = (option?: ICollectionOption) =>
  new CollectionIndex<ICar, [string]>([car => car.make], option);
export const getByIsNewIndex = (option?: ICollectionOption) =>
  new CollectionIndex<ICar, [boolean]>([car => car.isNew], option);
const byPriceRangeExtract = (car: ICar) => {
  if (car.price < 10000) {
    return PriceRangeName.under10k;
  }
  if (car.price >= 10000 && car.price < 20000) {
    return PriceRangeName['10k'];
  }
  if (car.price >= 20000 && car.price < 30000) {
    return PriceRangeName['20k'];
  }
  if (car.price >= 30000 && car.price < 40000) {
    return PriceRangeName['30k'];
  }
  if (car.price >= 40000 && car.price < 50000) {
    return PriceRangeName['40k'];
  }
  return PriceRangeName.over50k;
};
export const getByPriceRangeIndex = (option?: ICollectionOption) =>
  new CollectionIndex<ICar, [string]>([byPriceRangeExtract], option);
export const getByTagIndex = (option?: ICollectionOption) => {
  const tagsExtract: MultipleKeyExtract<ICar, AttributeTag> = (car: ICar) =>
    car.tags;
  tagsExtract.isMultiple = true;
  return new CollectionIndex<ICar, [AttributeTag]>([tagsExtract], option);
};
export const getByTagByPriceRangeIndex = (option?: ICollectionOption) => {
  const tagsExtract = buildMultipleKeyExtract((car: ICar) => car.tags);
  return new CollectionIndex<ICar, [AttributeTag, string]>(
    [tagsExtract, byPriceRangeExtract],
    option
  );
};
