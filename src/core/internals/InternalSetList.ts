import { IInternalList } from './IInternalList';

/**
 * An internal data structure that's based on a set
 * and output a new array if the set has changed
 * Change of set is notified through invalidate() method
 *
 * This is an unsupported internal class not meant to be used
 * beyond internal usage
 */
export class InternalSetList<T> implements IInternalList<T> {
  private _isSynced: boolean = false;
  private _output: T[] = [];

  constructor(public readonly source: Set<T>) {}
  /**
   * Mark the cached output as stale so it will be regenerated on next access.
   */
  invalidate(): void {
    this._isSynced = false;
  }

  /**
   * Number of items currently stored in the underlying set.
   */
  get count(): number {
    return this.source.size;
  }

  /**
   * Return a cached array of the set's contents. The array is refreshed lazily
   * when the set has changed.
   */
  get output(): readonly T[] {
    if (!this._isSynced) {
      this._isSynced = true;
      this._output = Array.from(this.source);
    }

    return this._output;
  }

  /**
   * Add an item to the set.
   */
  add(item: T): void {
    this.source.add(item);
    this.invalidate();
  }

  /**
   * Check whether the item exists in the set.
   */
  exists(item: T): boolean {
    return this.source.has(item);
  }

  /**
   * Remove an item from the set.
   */
  remove(item: T): void {
    this.source.delete(item);
    this.invalidate();
  }

  /**
   * Replace an existing item with a new one if it is present.
   */
  update(newItem: T, oldItem: T): void {
    if (this.source.has(oldItem)) {
      this.source.delete(oldItem);
      this.source.add(newItem);
      this.invalidate();
    }
  }

  /**
   * Sets have no order so this is a no-op.
   */
  moveBefore(_item: T, _before: T): void {
    // There is no concept of order in a set
    return;
  }

  /**
   * Sets have no order so this is a no-op.
   */
  moveAfter(_item: T, _after: T): void {
    // There is no concept of order in a set
    return;
  }
}
