import { IIndex } from '../core/IIndex';
import { IReadonlyCollection } from '../core/IReadonlyCollection';
import { IMutableCollection } from '../core/IMutableCollection';
import { CollectionChangeSignal } from '../signals/CollectionChangeSignal';
import { SignalObserver } from '../signals/SignalObserver';
import { ICollectionOption } from '../core/ICollectionOption';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { CollectionNature } from '../core/CollectionNature';
import { IInternalList } from '../core/internals/IInternalList';
import { InternalSetList } from '../core/internals/InternalSetList';
import { InternalList } from '../core/internals/InternalList';

export abstract class IndexedCollectionBase<T> extends SignalObserver
  implements IMutableCollection<T> {
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

  protected buildIndexes(indexes: readonly IIndex<T>[] = []): void {
    this.indexes = new Set(indexes);
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

  public addRange(items: readonly T[] | IReadonlyCollection<T>): boolean[] {
    const rawItems: readonly T[] = Array.isArray(items)
      ? items
      : (items as IReadonlyCollection<T>).items;
    return rawItems.map(item => this.add(item));
  }

  exists(item: T): boolean {
    return this._allItemList.exists(item);
  }

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
