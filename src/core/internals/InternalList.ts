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
}
