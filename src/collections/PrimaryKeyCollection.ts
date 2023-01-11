import { IndexedCollectionBase } from './IndexedCollectionBase';
import { IIndex } from '../core/IIndex';
import { Optional } from '../core/Optional';
import { ICollectionOption } from '../core/ICollectionOption';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { CollectionIndex } from '../indexes/CollectionIndex';
import { SingleKeyExtract } from '../core/KeyExtract';

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

  byPrimaryKey(keyValue: IdT): Optional<T> {
    return this.idIndex.getValue(keyValue)[0];
  }
}
