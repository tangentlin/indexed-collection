import { IInternalList } from './IInternalList';

/**
 * A simple list that outputs a new array of the list if
 * the based array has been modified
 *
 * This is an unsupported internal class not meant to be used
 * beyond internal usage
 */
export class InternalList<T> implements IInternalList<T> {
  private _isSynced: boolean = false;
  private _output: T[] = [];
  constructor(public readonly source: T[]) {}

  invalidate() {
    this._isSynced = false;
  }

  get count(): number {
    return this.source.length;
  }

  get output(): readonly T[] {
    if (!this._isSynced) {
      this._isSynced = true;
      this._output = this.source.concat();
    }

    return this._output;
  }

  exists(item: T): boolean {
    return this.source.includes(item);
  }

  add(item: T): void {
    this.source.push(item);
    this.invalidate();
  }

  remove(item: T): void {
    const index: number = this.source.findIndex(listItem => listItem === item);
    if (index >= 0) {
      this.source.splice(index, 1);
      this.invalidate();
    }
  }

  update(newItem: T, oldItem: T): void {
    const index: number = this.source.findIndex(listItem => listItem === oldItem);
    if (index >= 0) {
      this.source[index] = newItem;
      this.invalidate();
    }
  }

  moveBefore(item: T, before: T): void {
    const itemIndex: number = this.source.findIndex(listItem => listItem === item);
    const beforeIndex: number = this.source.findIndex(listItem => listItem === before);
    if (itemIndex >= 0 && beforeIndex >= 0) {
      this.source.splice(itemIndex, 1);
      this.source.splice(beforeIndex, 0, item);
      this.invalidate();
    }
  }

  moveAfter(item: T, after: T): void {
    const itemIndex: number = this.source.findIndex(listItem => listItem === item);
    const afterIndex: number = this.source.findIndex(listItem => listItem === after);

    if (itemIndex >= 0 && afterIndex >= 0) {
      this.source.splice(itemIndex, 1);
      const targetIndex = itemIndex < afterIndex ? afterIndex : afterIndex + 1;
      this.source.splice(targetIndex, 0, item);
      this.invalidate();
    }
  }
}
