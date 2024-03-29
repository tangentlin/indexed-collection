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
  invalidate(): void {
    this._isSynced = false;
  }

  get count(): number {
    return this.source.size;
  }

  get output(): readonly T[] {
    if (!this._isSynced) {
      this._isSynced = true;
      this._output = Array.from(this.source);
    }

    return this._output;
  }

  add(item: T): void {
    this.source.add(item);
    this.invalidate();
  }

  exists(item: T): boolean {
    return this.source.has(item);
  }

  remove(item: T): void {
    this.source.delete(item);
    this.invalidate();
  }

  update(newItem: T, oldItem: T): void {
    if (this.source.has(oldItem)) {
      this.source.delete(oldItem);
      this.source.add(newItem);
      this.invalidate();
    }
  }

  moveBefore(_item: T, _before: T): void {
    // There is no concept of order in a set
    return;
  }

  moveAfter(_item: T, _after: T): void {
    // There is no concept of order in a set
    return;
  }
}
