export enum CollectionNature {
  /**
   * The items in the collection should always be unique, and order does not matter
   * This option is always performant
   */
  Set = 'set',
  /**
   * The items in the collection should always preserve the order it is entered in the collection
   */
  Array = 'array',
}
