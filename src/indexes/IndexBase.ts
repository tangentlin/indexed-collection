import { CollectionNature } from '../core/CollectionNature';
import { type ICollectionOption } from '../core/ICollectionOption';
import { IIndex } from '../core/IIndex';
import { KeyExtract } from '../core/KeyExtract';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { IInternalList } from '../core/internals/IInternalList';
import { InternalList } from '../core/internals/InternalList';
import { InternalSetList } from '../core/internals/InternalSetList';

const emptyArray = Object.freeze([]);

type SetOrArray<T> = Set<T> | T[];
type LeafMap<T, KeyT = unknown> = Map<KeyT, IInternalList<T>>;

/**
 * Base class for index implementations. An index maps one or more keys to the
 * items they reference. Keys are extracted using the provided key extraction
 * functions.
 */
export abstract class IndexBase<T> implements IIndex<T> {
  protected readonly _keyFns: readonly KeyExtract<T>[];
  protected readonly option: Readonly<ICollectionOption>;
  public internalMap = new Map();

  protected constructor(
    keyFns: readonly KeyExtract<T>[],
    option: Readonly<ICollectionOption> = defaultCollectionOption
  ) {
    this._keyFns = keyFns;
    this.option = Object.freeze(Object.assign({}, defaultCollectionOption, option));
  }

  /**
   * Add an item to the index under all of the keys produced by the key
   * extractors.
   *
   * @param item The item to index
   * @returns True if the item was inserted for at least one key
   */
  index(item: T): boolean {
    const keys = this.getKeys(item);
    const leafMaps = this.getLeafMaps(keys, true);
    const lastIndex = keys.length - 1;
    const lastKeys = keys[lastIndex];
    let added = false;
    const isUsingSet = this.option.nature === CollectionNature.Set;
    for (const leafMap of leafMaps) {
      for (const key of lastKeys) {
        const result = addItemToMap(key, item, leafMap, isUsingSet);
        added = added || result;
      }
    }
    return added;
  }

  /**
   * Remove an item from the index for all of its associated keys.
   *
   * @param item The item to unindex
   * @returns True if the item existed for at least one key
   */
  removeFromIndex(item: T): boolean {
    const keys = this.getKeys(item);
    const leafMaps = this.getLeafMaps(keys, false);
    const lastKeys = keys[keys.length - 1];

    let removed = false;

    for (const leafMap of leafMaps) {
      for (const key of lastKeys) {
        const result = removeItemFromMap(key, item, leafMap);
        removed = removed || result;
      }
    }

    return removed;
  }

  /**
   * Retrieve items stored under the specified sequence of keys.
   *
   * @param keys Keys identifying the value within the index
   * @returns A readonly array of matched items
   */
  protected getValueInternal(keys: readonly unknown[]): readonly T[] {
    const convertedKeys = keys.map(k => [k]);
    const leafMaps = this.getLeafMaps(convertedKeys, false);
    const lastKey = keys[keys.length - 1];
    const values = leafMaps[0]?.get(lastKey);
    if (values == null) {
      return emptyArray;
    }

    return values.output;
  }

  /**
   * Extract the key values for the given item using all key extractor
   * functions.
   *
   * Single-value extractors are wrapped in an array so all returned values are
   * iterable.
   *
   * @param item The item whose keys are being generated
   */
  protected getKeys(item: T): SetOrArray<unknown>[] {
    // @ts-ignore
    return this._keyFns.map(keyFn => {
      return keyFn.isMultiple ? keyFn(item) : [keyFn(item)];
    });
  }

  /**
   * Walk or create the nested map structure for the provided keys and return
   * the leaf maps corresponding to the last key segment.
   *
   * @param keys Array of key values for each level of the index
   */
  protected getLeafMaps(
    keys: SetOrArray<unknown>[],
    createIfMissing: boolean
  ): LeafMap<T>[] {
    if (keys.length === 1) {
      return [this.internalMap as LeafMap<T>];
    }

    let currentLevelMap: Map<unknown, unknown>[] = [this.internalMap];
    for (let i = 0; i < keys.length - 1; i++) {
      const maps: Map<unknown, unknown>[] = [];
      for (const key of keys[i]) {
        for (const map of currentLevelMap) {
          let next = map.get(key) as Map<unknown, unknown> | undefined;
          if (next == null) {
            if (!createIfMissing) {
              continue;
            }
            next = new Map();
            map.set(key, next);
          }
          maps.push(next);
        }
      }
      if (maps.length === 0) {
        return [];
      }
      currentLevelMap = maps;
    }

    return currentLevelMap as LeafMap<T>[];
  }

  /**
   * Clear all stored keys and values from the index.
   */
  reset() {
    this.internalMap = new Map();
  }
}

/**
 * Create a new internal list depending on collection nature.
 *
 * @param isUsingSet When true a set backed list will be created
 */
function getNewInternalList<T>(isUsingSet: boolean): IInternalList<T> {
  return isUsingSet ? new InternalSetList(new Set()) : new InternalList([]);
}

/**
 * Add an item to a map under a specific key, creating the key if needed.
 *
 * @returns True if the item was inserted
 */
function addItemToMap<T>(key: unknown, item: T, map: LeafMap<T>, isUsingSet: boolean): boolean {
  if (!map.has(key)) {
    const content: IInternalList<T> = getNewInternalList(isUsingSet);
    content.add(item);
    map.set(key, content);
    return true;
  }

  const items = map.get(key) as IInternalList<T>;
  if (!items.exists(item)) {
    items.add(item);
    return true;
  }
  return false;
}

/**
 * Remove an item from a map for the given key if it exists.
 */
function removeItemFromMap<T>(key: unknown, item: T, map: LeafMap<T>): boolean {
  const items = map.get(key) as IInternalList<T>;
  if (items != null && items.exists(item)) {
    items.remove(item);
    return true;
  }
  return false;
}
