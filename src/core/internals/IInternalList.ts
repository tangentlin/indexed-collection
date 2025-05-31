export interface IInternalList<T> {
  /**
   * Add item to list regardless of existence of such item
   * @param item
   */
  add(item: T): void;

  /**
   * Remove the first instance item to list regardless of existence of such item
   * @param item
   */
  remove(item: T): void;

  /**
   * Whether the specified item exists in the list
   * @param item
   */
  exists(item: T): boolean;

  /**
   * Signal that the list has changed so cached output should be regenerated.
   */
  invalidate(): void;

  /**
   * Update the old item with the new item
   * @param newItem
   * @param oldItem
   */
  update(newItem: T, oldItem: T): void;

  /**
   * Move the item before another item
   * @param item
   * @param before
   */
  moveBefore(item: T, before: T): void;

  /**
   * Move the item after another item
   * @param item
   * @param after
   */
  moveAfter(item: T, after: T): void;

  readonly output: readonly T[];

  readonly count: number;
}
