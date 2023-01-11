/**
 * Delegate for extracting key from the given item
 */
export type KeyExtract<T = unknown, KeyT = unknown> =
  | SingleKeyExtract<T, KeyT>
  | MultipleKeyExtract<T, KeyT>;

export type SingleKeyExtract<T = unknown, KeyT = unknown> = {
  isMultiple?: boolean;
  (item: T): KeyT;
};

export type MultipleKeyExtract<T = unknown, KeyT = unknown> = {
  isMultiple: true;
  (item: T): readonly KeyT[] | ReadonlySet<KeyT>;
};
