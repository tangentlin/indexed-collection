import { IIndex } from '../core/IIndex';
import { SingleKeyExtract } from '../core/KeyExtract';
import { Optional } from '../core/Optional';
import { CollectionIndex } from '../indexes/CollectionIndex';

import {
  IndexedCollectionBase,
  type IndexedCollectionOptions,
} from './IndexedCollectionBase';

/**
 * A collection where every item contains a unique identifier key (aka primary key)
 */
export interface PrimaryKeyCollectionOptions<T, IdT>
  extends IndexedCollectionOptions<T> {
  primaryKeyExtract: SingleKeyExtract<T, IdT>;
}

export class PrimaryKeyCollection<T, IdT = string> extends IndexedCollectionBase<T> {
  protected readonly idIndex: CollectionIndex<T, [IdT]>;
  public readonly primaryKeyExtract: SingleKeyExtract<T, IdT>;
  constructor(options: PrimaryKeyCollectionOptions<T, IdT>) {
    const { option } = options;
    super({ option });
    this.primaryKeyExtract = options.primaryKeyExtract;
    this.idIndex = new CollectionIndex<T, [IdT]>([this.primaryKeyExtract]);
    this.buildIndexes(options.indexes ?? []);
    if (options.initialValues) {
      this.addRange(options.initialValues);
    }
  }

  protected override buildIndexes(indexes: readonly IIndex<T>[], autoReindex?: boolean): void {
    const combinedIndex: IIndex<T>[] = [];
    if (this.idIndex != null) {
      // this.idIndex can be null during instantiation
      combinedIndex.push(this.idIndex);
    }
    if (indexes != null && indexes.length > 0) {
      combinedIndex.push(...indexes);
    }
    super.buildIndexes(combinedIndex, autoReindex);
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
