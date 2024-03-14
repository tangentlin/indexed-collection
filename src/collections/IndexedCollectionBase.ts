import { CollectionNature } from '../core/CollectionNature';
import { ICollectionOption } from '../core/ICollectionOption';
import { IIndex } from '../core/IIndex';
import { IMutableCollection } from '../core/IMutableCollection';
import { IReadonlyCollection } from '../core/IReadonlyCollection';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { IInternalList } from '../core/internals/IInternalList';
import { InternalList } from '../core/internals/InternalList';
import { InternalSetList } from '../core/internals/InternalSetList';
import { CollectionChangeSignal } from '../signals/CollectionChangeSignal';
import { SignalObserver } from '../signals/SignalObserver';

export abstract class IndexedCollectionBase<T>
  extends SignalObserver
  implements IMutableCollection<T>
{
  private _allItemList: IInternalList<T> = new InternalSetList<T>(new Set());

  protected indexes: Set<IIndex<T>> = new Set();

  private _pauseChangeSignal: boolean = false;
  private _hasPendingChangeSignal: boolean = false;

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
  protected buildIndexes(
    indexes: readonly IIndex<T>[],
    autoReindex: boolean = true
  ): void {
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
    this.notifyChange();
    return true;
  }

  public addRange(
    items: readonly T[] | IReadonlyCollection<T> | ReadonlySet<T>
  ): boolean[] {
    // const rawItems: readonly T[] = Array.isArray(items)
    //   ? items
    //   : (items as IReadonlyCollection<T>).items;

    let rawItems: Readonly<Iterable<T>>;
    if (Array.isArray(items)) {
      rawItems = items;
    } else if (items instanceof Set) {
      rawItems = Array.from(items);
    } else {
      rawItems = (items as IReadonlyCollection<T>).items;
    }

    this.pauseChangeSignal();
    let result: boolean[] = [];
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
    this.notifyChange();
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
    this.notifyChange();
    return true;
  }

  get items(): readonly T[] {
    return this._allItemList.output;
  }

  get count(): number {
    return this._allItemList.count;
  }

  protected notifyChange(): void {
    if (this._pauseChangeSignal) {
      this._hasPendingChangeSignal = true;
      return;
    }
    this.notifyObservers(new CollectionChangeSignal(this));
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
        this.notifyChange();
      }
    }
  }
}
