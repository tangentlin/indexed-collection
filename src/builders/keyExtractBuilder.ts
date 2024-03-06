import { MultipleKeyExtract } from '../core';

export function buildMultipleKeyExtract<T = unknown, KeyT = unknown>(
  getKeys: (item: T) => readonly KeyT[] | ReadonlySet<KeyT>
): MultipleKeyExtract<T, KeyT> {
  const result: MultipleKeyExtract<T, KeyT> = (item: T) => getKeys(item);
  result.isMultiple = true;
  return result;
}
