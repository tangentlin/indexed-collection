import {
  ICollectionOption,
  IndexedCollectionBase,
  CollectionIndex,
  MultipleKeyExtract,
} from '../src';

export enum AttributeTag {
  Automatic = 'automatic',
  Manual = 'manual',
  Sedan = 'sedan',
  Suv = 'suv',
  Gas = 'gas',
  Electric = 'electric',
  Hybrid = 'hybrid',
}

export interface ICar {
  id: string;
  make: string;
  model: string;
  isNew: boolean;
  price: number;

  tags: AttributeTag[];
}

export const newTeslaModel3 = {
  id: '3n',
  make: 'Tesla',
  model: 'Model 3',
  isNew: true,
  price: 45000,
  tags: [AttributeTag.Automatic, AttributeTag.Electric, AttributeTag.Sedan],
};

export const usedTeslaModel3 = {
  id: '3u',
  make: 'Tesla',
  model: 'Model 3',
  isNew: false,
  price: 27500,
  tags: [AttributeTag.Automatic, AttributeTag.Electric, AttributeTag.Sedan],
};

export const newTeslaModelX = {
  id: 'xn',
  make: 'Tesla',
  model: 'Model X',
  isNew: true,
  price: 125000,
  tags: [AttributeTag.Automatic, AttributeTag.Electric, AttributeTag.Suv],
};

export const usedTeslaModelX = {
  id: 'xu',
  make: 'Tesla',
  model: 'Model X',
  isNew: false,
  price: 78000,
  tags: [AttributeTag.Automatic, AttributeTag.Electric, AttributeTag.Suv],
};

export const newChevyEquinox = {
  id: 'en',
  make: 'Chevy',
  model: 'Equinox',
  isNew: true,
  price: 26500,
  tags: [AttributeTag.Automatic, AttributeTag.Gas, AttributeTag.Suv],
};

export const usedChevyEquinox = {
  id: 'en',
  make: 'Chevy',
  model: 'Equinox',
  isNew: false,
  price: 17500,
  tags: [AttributeTag.Automatic, AttributeTag.Gas, AttributeTag.Suv],
};

export const newChevyCamero = {
  id: 'cn',
  make: 'Chevy',
  model: 'Camero',
  isNew: true,
  price: 31500,
  tags: [AttributeTag.Automatic, AttributeTag.Gas, AttributeTag.Sedan],
};

export const usedChevyCamero = {
  id: 'cu',
  make: 'Chevy',
  model: 'Camero',
  isNew: false,
  price: 19500,
  tags: [AttributeTag.Manual, AttributeTag.Gas, AttributeTag.Sedan],
};

export const allCars = [
  newTeslaModel3,
  usedTeslaModel3,
  newTeslaModelX,
  usedTeslaModelX,
  newChevyEquinox,
  usedChevyEquinox,
  newChevyCamero,
  usedChevyCamero,
];

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
  const tagsExtract: MultipleKeyExtract<ICar, AttributeTag> = (car: ICar) =>
    car.tags;
  tagsExtract.isMultiple = true;
  return new CollectionIndex<ICar, [AttributeTag, string]>(
    [tagsExtract, byPriceRangeExtract],
    option
  );
};

export class CarCollection extends IndexedCollectionBase<ICar> {
  private readonly byMakeIndex: CollectionIndex<ICar, [string]>;
  private readonly byIsNewIndex: CollectionIndex<ICar, [boolean]>;
  private readonly byPriceRangeIndex: CollectionIndex<ICar, [string]>;
  private readonly byTagIndex: CollectionIndex<ICar, [AttributeTag]>;
  private readonly byTagByPriceRangeIndex: CollectionIndex<
    ICar,
    [AttributeTag, string]
  >;

  constructor(option?: ICollectionOption) {
    super(undefined, undefined, option);
    this.byMakeIndex = getByMakeIndex(option);
    this.byIsNewIndex = getByIsNewIndex(option);
    this.byPriceRangeIndex = getByPriceRangeIndex(option);
    this.byTagIndex = getByTagIndex(option);
    this.byTagByPriceRangeIndex = getByTagByPriceRangeIndex(option);

    this.buildIndexes([
      this.byMakeIndex,
      this.byIsNewIndex,
      this.byPriceRangeIndex,
      this.byTagIndex,
      this.byTagByPriceRangeIndex,
    ]);
  }

  byMake(make: string): readonly ICar[] {
    return this.byMakeIndex.getValue(make);
  }

  byIsNew(isNew: boolean): readonly ICar[] {
    return this.byIsNewIndex.getValue(isNew);
  }

  byPriceRange(priceRange: string): readonly ICar[] {
    return this.byPriceRangeIndex.getValue(priceRange);
  }

  byTag(tag: AttributeTag): readonly ICar[] {
    return this.byTagIndex.getValue(tag);
  }

  byTagByPriceRange(tag: AttributeTag, priceRange: string): readonly ICar[] {
    return this.byTagByPriceRangeIndex.getValue(tag, priceRange);
  }
}
