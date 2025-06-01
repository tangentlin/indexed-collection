import { CollectionNature } from '../core/CollectionNature';
import { ICollectionChangeDetail } from '../core/ICollectionChangeDetail';
import { ICollectionOption } from '../core/ICollectionOption';
import { IIndex } from '../core/IIndex';
import { IMutableCollection } from '../core/IMutableCollection';
import { IReadonlyCollection } from '../core/IReadonlyCollection';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { IInternalList } from '../core/internals/IInternalList';
import { InternalList } from '../core/internals/InternalList';
import { InternalSetList } from '../core/internals/InternalSetList';
import { CollectionAddSignal } from '../signals/CollectionAddSignal';
import { CollectionChangeSignal } from '../signals/CollectionChangeSignal';
import { CollectionRemoveSignal } from '../signals/CollectionRemoveSignal';
import { CollectionUpdateSignal } from '../signals/CollectionUpdateSignal';
import { SignalObserver } from '../signals/SignalObserver';

import { mergeCollectionChangeDetail } from './util';

export abstract class IndexedCollectionBase<T> extends SignalObserver implements IMutableCollection<T> {
  private _allItemList: IInternalList<T> = new InternalSetList<T>(new Set());

  protected indexes: Set<IIndex<T>> = new Set();

  private _pauseChangeSignal: boolean = false;
  private _hasPendingChangeSignal: boolean = false;
  private _pendingChange: Partial<ICollectionChangeDetail<T>> = {};

  public readonly option: Readonly<ICollectionOption>;

  protected constructor(
    initialValues?: readonly T[],
    additionalIndexes: ReadonlyArray<IIndex<T>> = [],
    option: Partial<ICollectionOption> = defaultCollectionOption
  ) {
    super();
    this.option = Object.assign({}, defaultCollectionOption, option);
    this.buildIndexes(additionalIndexes);
    if (this.option.nature === CollectionNature.Set) {
      this._allItemList = new InternalSetList<T>(new Set());
    } else {
      this._allItemList = new InternalList<T>([]);
    }
    if (initialValues) {
      this.addRange(initialValues);
    }
  }

  rebuild(): void {
    this.reindex();
  }

  protected reindex(): void {
    for (const index of this.indexes) {
      index.reset();
    }

    const items = this._allItemList.output;
    for (const item of items) {
      for (const index of this.indexes) {
        index.index(item);
      }
    }
  }

  /**
   * Rebuild indexes
   * @param indexes
   * @param autoReindex if true, all items will be reindexed
   */
  protected buildIndexes(indexes: readonly IIndex<T>[], autoReindex: boolean = true): void {
    this.indexes = new Set(indexes);
    if (autoReindex) {
      this.reindex();
    }
  }

  public add(item: T): boolean {
    if (this.exists(item)) {
      return false;
    }

    this._allItemList.add(item);

    for (const index of this.indexes) {
      index.index(item);
    }
    this.notifyChange({
      added: [item],
    });
    return true;
  }

  public addRange(items: readonly T[] | IReadonlyCollection<T> | ReadonlySet<T>): boolean[] {
    let rawItems: Readonly<Iterable<T>>;
    if (Array.isArray(items)) {
      rawItems = items;
    } else if (items instanceof Set) {
      rawItems = Array.from(items);
    } else {
      rawItems = (items as IReadonlyCollection<T>).items;
    }

    this.pauseChangeSignal();
    const result: boolean[] = [];
    for (const item of rawItems) {
      result.push(this.add(item));
    }
    this.resumeChangeSignal();
    return result;
  }

  exists(item: T): boolean {
    return this._allItemList.exists(item);
  }

  /**
   * Remove item from the collection
   * @param item
   * @returns
   */
  remove(item: T): boolean {
    if (!this.exists(item)) {
      return false;
    }

    this._allItemList.remove(item);

    for (const index of this.indexes) {
      index.unIndex(item);
    }
    this.notifyChange({
      removed: [item],
    });
    return true;
  }

  update(newItem: T, oldItem: T): boolean {
    if (!this.exists(oldItem)) {
      return false;
    }

    for (const index of this.indexes) {
      index.unIndex(oldItem);
    }

    this._allItemList.update(newItem, oldItem);

    for (const index of this.indexes) {
      index.index(newItem);
    }
    this.notifyChange({
      updated: [{ oldValue: oldItem, newValue: newItem }],
    });
    return true;
  }

  /**
   * Move item before the specified item
   * @param item The item to move
   * @param before
   */
  moveBefore(item: T, before: T): void {
    this._allItemList.moveBefore(item, before);
  }

  /**
   * Move item after the specified item
   * @param item The item to move
   * @param after
   */
  moveAfter(item: T, after: T): void {
    this._allItemList.moveAfter(item, after);
  }

  get items(): readonly T[] {
    return this._allItemList.output;
  }

  get count(): number {
    return this._allItemList.count;
  }

  protected notifyChange(change: Partial<ICollectionChangeDetail<T>>): void {
    if (this._pauseChangeSignal) {
      this._hasPendingChangeSignal = true;
      this._pendingChange = mergeCollectionChangeDetail(this._pendingChange, change);
      return;
    }

    const changes = mergeCollectionChangeDetail({}, change);
    this.notifyObservers(new CollectionChangeSignal(this, changes));

    if (changes.added.length > 0) {
      this.notifyObservers(new CollectionAddSignal(this, changes.added));
    }

    if (changes.removed.length > 0) {
      this.notifyObservers(new CollectionRemoveSignal(this, changes.removed));
    }

    if (changes.updated.length > 0) {
      this.notifyObservers(new CollectionUpdateSignal(this, changes.updated));
    }
  }

  /**
   * Pause change signal when collection content has changed
   * This is useful when the collection is undergoing batch changes
   * that the collection would not cause too many down stream change reaction
   * during batch update.
   *
   * If there are any changes during pause period, resumeChangeEvent
   * will dispatch change event.
   */
  pauseChangeSignal(): void {
    if (!this._pauseChangeSignal) {
      this._pauseChangeSignal = true;
      this._hasPendingChangeSignal = false;
    }
  }

  /**
   * Resume change signal from its pause state
   * if there are any pending changes, change signal will be notified
   */
  resumeChangeSignal(): void {
    if (this._pauseChangeSignal) {
      this._pauseChangeSignal = false;
      if (this._hasPendingChangeSignal) {
        this._hasPendingChangeSignal = false;
        this.notifyChange(this._pendingChange);
        this._pendingChange = {};
      }
    }
  }
}
