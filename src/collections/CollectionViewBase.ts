import { ICollectionAndView } from '../core/ICollectionAndView';
import { ICollectionViewOption } from '../core/ICollectionViewOption';
import { IReadonlyCollection } from '../core/IReadonlyCollection';
import { Optional } from '../core/Optional';
import {
  defaultCollectionViewOption,
  defaultSort,
} from '../core/defaultCollectionViewOption';
import { CollectionAddSignal } from '../signals/CollectionAddSignal';
import { CollectionChangeSignal } from '../signals/CollectionChangeSignal';
import { CollectionRemoveSignal } from '../signals/CollectionRemoveSignal';
import { CollectionUpdateSignal } from '../signals/CollectionUpdateSignal';
import { SignalObserver } from '../signals/SignalObserver';
import { filterCollectionChangeDetail } from './util';

/**
 * CollectionView is a view onto a collection of data.  Most common use case would be
 * having the collection reduced by filter and/or sorted according to various criteria
 * without modifying the underlying data.
 */
export abstract class CollectionViewBase<
    T,
    SourceCollectionT extends ICollectionAndView<T>
  >
  extends SignalObserver
  implements IReadonlyCollection<T>
{
  private readonly _source: SourceCollectionT;
  private readonly _option: ICollectionViewOption<T>;
  private _cachedItems: T[] = [];

  protected constructor(
    source: SourceCollectionT,
    option: Partial<ICollectionViewOption<T>> = defaultCollectionViewOption
  ) {
    super();
    this._source = source;
    this._option = Object.assign({}, defaultCollectionViewOption, option);
    this.rebuildCache();
    this._source.registerObserver(
      CollectionChangeSignal.type,
      this.source_onChange.bind(this)
    );
  }

  /**
   * Reindex the entire collection
   */
  public rebuild(deep: boolean = false): void {
    if (deep) {
      this.source.rebuild(deep);
    }

    this.rebuildCache();
  }

  protected rebuildCache(): void {
    this._cachedItems = this.applyFilterAndSort(this._source.items);
  }

  protected applyFilterAndSort(list: readonly T[]): T[] {
    const filtered: T[] =
      this._option.filter === defaultCollectionViewOption.filter
        ? [...list]
        : list.filter(this._option.filter);
    return this.sort === defaultSort ? filtered : filtered.sort(this.sort);
  }

  public returnItemIfPassesFilter(item?: T): Optional<T> {
    if (item === undefined) {
      return undefined;
    }
    return this.filter(item) ? item : undefined;
  }

  protected source_onChange(signal: CollectionChangeSignal<T>): void {
    this.rebuildCache();
    this.notifyChange(signal);
  }

  public notifyChange(signal: CollectionChangeSignal<T>): void {
    const changes = filterCollectionChangeDetail(signal.detail, this.filter);

    const addedCount = changes.added.length;
    const removedCount = changes.removed.length;
    const updatedCount = changes.updated.length;

    if (addedCount === 0 && removedCount === 0 && updatedCount === 0) {
      return;
    }

    this.notifyObservers(new CollectionChangeSignal(this, changes));

    if (addedCount > 0) {
      this.notifyObservers(new CollectionAddSignal(this, changes.added));
    }

    if (removedCount > 0) {
      this.notifyObservers(new CollectionRemoveSignal(this, changes.removed));
    }

    if (updatedCount > 0) {
      this.notifyObservers(new CollectionUpdateSignal(this, changes.updated));
    }
  }

  get count(): number {
    return this._cachedItems.length;
  }

  get items(): readonly T[] {
    return this._cachedItems;
  }

  exists(item: T): boolean {
    if (!this._source.exists(item)) {
      return false;
    }
    return Boolean(this.returnItemIfPassesFilter(item));
  }

  get source(): SourceCollectionT {
    return this._source;
  }

  get filter(): ICollectionViewOption<T>['filter'] {
    return this._option.filter;
  }

  get sort(): ICollectionViewOption<T>['sort'] {
    return this._option.sort;
  }
}
