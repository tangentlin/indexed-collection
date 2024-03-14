import { ICollectionChangeDetail } from '../core/ICollectionChangeDetail';

export function mergeCollectionChangeDetail<T>(
  a: Partial<ICollectionChangeDetail<T>>,
  b: Partial<ICollectionChangeDetail<T>>
): ICollectionChangeDetail<T> {
  const added = a.added
    ? b.added
      ? a.added.concat(b.added)
      : a.added
    : b.added;
  const removed = a.removed
    ? b.removed
      ? a.removed.concat(b.removed)
      : a.removed
    : b.removed;
  const updated = a.updated
    ? b.updated
      ? a.updated.concat(b.updated)
      : a.updated
    : b.updated;
  return {
    added: added ?? [],
    removed: removed ?? [],
    updated: updated ?? [],
  };
}

export function filterCollectionChangeDetail<T>(
  change: Readonly<ICollectionChangeDetail<T>>,
  filter: (item: T) => boolean
): ICollectionChangeDetail<T> {
  const added = change.added.filter(filter);
  const removed = change.removed.filter(filter);
  const updated = change.updated.filter((item) => filter(item.newValue));
  return {
    added,
    removed,
    updated,
  };
}
