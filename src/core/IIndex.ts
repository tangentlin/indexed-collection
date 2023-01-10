export interface IIndex<T> {
  /**
   * Add an item into the index
   * @param item
   * @return true if the item has been added to the index successfully.
   */
  index(item: T): boolean;

  /**
   * Remove an item from the index
   * @param item
   * @return true if the item has been removed to the index successfully.
   */
  unIndex(item: T): boolean;

  reset(): void;
}
