import { ICollectionOption } from '../core/ICollectionOption';
import { IIndex } from '../core/IIndex';
import { SingleKeyExtract } from '../core/KeyExtract';
import { Optional } from '../core/Optional';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { CollectionIndex } from '../indexes/CollectionIndex';
import { IndexedCollectionBase } from './IndexedCollectionBase';

/**
 * A collection where every item contains a unique identifier key (aka primary key)
 */
export class PrimaryKeyCollection<
  T,
  IdT = string
> extends IndexedCollectionBase<T> {
  protected readonly idIndex: CollectionIndex<T, [IdT]>;
  constructor(
    public readonly primaryKeyExtract: SingleKeyExtract<T, IdT>,
    initialValues?: readonly T[],
    additionalIndexes: ReadonlyArray<IIndex<T>> = [],
    option: Readonly<ICollectionOption> = defaultCollectionOption
  ) {
    super(undefined, undefined, option);
    this.idIndex = new CollectionIndex<T, [IdT]>([primaryKeyExtract]);
    this.buildIndexes([this.idIndex, ...additionalIndexes]);
    if (initialValues) {
      this.addRange(initialValues);
    }
  }

  exists(item: T): boolean {
    const key = this.primaryKeyExtract(item);
    return Boolean(this.byPrimaryKey(key));
  }

  /**
   * Get the item by its primary key
   * @param keyValue
   * @returns
   */
  byPrimaryKey(keyValue: IdT): Optional<T> {
    return this.idIndex.getValue(keyValue)[0];
  }

  override update(newItem: T): boolean {
    const key = this.primaryKeyExtract(newItem);
    const oldItem = this.byPrimaryKey(key);
    if (oldItem) {
      return super.update(newItem, oldItem);
    }
    return false;
  }
}
