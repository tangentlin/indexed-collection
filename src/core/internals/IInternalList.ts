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
   * Signal the list has
   */
  invalidate(): void;
}
