import {
  CollectionIndex,
  ICollectionOption,
  IndexedCollectionBase,
} from '../../src';
import { AttributeTag, ICar } from './data';
import {
  getByIsNewIndex,
  getByMakeIndex,
  getByPriceRangeIndex,
  getByTagByPriceRangeIndex,
  getByTagIndex,
} from './indexes';

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
