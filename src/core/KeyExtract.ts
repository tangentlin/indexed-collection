/**
 * Delegate for extracting key from the given item
 */
export type KeyExtract<T, KeyT> =
  | SingleKeyExtract<T, KeyT>
  | MultipleKeyExtract<T, KeyT>;

export type SingleKeyExtract<T, KeyT> = {
  isMultiple?: boolean;
  (item: T): KeyT;
};

export type MultipleKeyExtract<T, KeyT> = {
  isMultiple: true;
  (item: T): readonly KeyT[] | ReadonlySet<KeyT>;
};
