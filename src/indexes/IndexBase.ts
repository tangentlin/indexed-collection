import { KeyExtract } from '../core/KeyExtract';
import { ICollectionOption } from '../core/ICollectionOption';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { CollectionNature } from '../core/CollectionNature';

const emptyArray = Object.freeze([]);

type SetOrArray<T> = Set<T> | T[];
type LeafMap<T, KeyT = unknown> = Map<KeyT, SetOrArray<T>>;

export abstract class IndexBase<T> {
  protected readonly _keyFns: KeyExtract<T, unknown>[];
  protected readonly option: Readonly<ICollectionOption>;
  public internalMap = new Map();

  protected constructor(
    keyFns: KeyExtract<T, unknown>[],
    option: Readonly<ICollectionOption> = defaultCollectionOption
  ) {
    this._keyFns = keyFns;
    this.option = Object.freeze(
      Object.assign({}, defaultCollectionOption, option)
    );
  }

  index(item: T): boolean {
    const keys = this.getKeys(item);
    const leafMaps = this.getLeafMaps(keys);
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

  unIndex(item: T): boolean {
    const keys = this.getKeys(item);
    const leafMaps = this.getLeafMaps(keys);
    const lastKeys = keys[keys.length - 1];

    let removed = false;
    const isUsingSet = this.option.nature === CollectionNature.Set;

    for (const leafMap of leafMaps) {
      for (const key of lastKeys) {
        const result = removeItemFromMap(key, item, leafMap, isUsingSet);
        removed = removed || result;
      }
    }

    return removed;
  }

  protected getValueInternal(keys: unknown[]): readonly T[] {
    const convertedKeys = keys.map(k => [k]);
    const leafMaps = this.getLeafMaps(convertedKeys);
    const lastKey = keys[keys.length - 1];
    const values = leafMaps[0]?.get(lastKey);
    if (values == null) {
      return emptyArray;
    }

    return values instanceof Set ? Array.from(values) : values;
  }

  protected getKeys(item: T): SetOrArray<unknown>[] {
    // @ts-ignore
    return this._keyFns.map((keyFn, index) => {
      return keyFn.isMultiple ? keyFn(item) : [keyFn(item)];
    });
  }

  protected getLeafMaps(keys: SetOrArray<unknown>[]): LeafMap<T>[] {
    if (keys.length === 1) {
      return [this.internalMap as LeafMap<T>];
    }

    let currentLevelMap = [this.internalMap];
    for (let i = 0; i < keys.length - 1; i++) {
      const maps = [];
      for (const key of keys[i]) {
        for (const map of currentLevelMap) {
          if (!map.has(key)) {
            map.set(key, new Map());
          }
          maps.push(map.get(key));
        }
      }

      currentLevelMap = maps;
    }

    return currentLevelMap as LeafMap<T>[];
  }

  reset() {
    this.internalMap = new Map();
  }
}

function addItemToMap<T>(
  key: unknown,
  item: T,
  map: LeafMap<T>,
  isUsingSet: boolean
): boolean {
  if (!map.has(key)) {
    const content: SetOrArray<T> = isUsingSet ? new Set([item]) : [item];
    map.set(key, content);
    return true;
  }

  const items = map.get(key);
  if (isUsingSet) {
    const itemSet = items as Set<T>;
    if (!itemSet.has(item)) {
      itemSet.add(item);
      return true;
    }
  } else {
    const itemArray = items as T[];
    if (!itemArray.includes(item)) {
      itemArray.push(item);
      return true;
    }
  }
  return false;
}

function removeItemFromMap<T>(
  key: unknown,
  item: T,
  map: LeafMap<T>,
  isUsingSet: boolean
): boolean {
  const items = map.get(key);
  if (isUsingSet) {
    const itemSet = items as Set<T>;
    if (itemSet.has(item)) {
      itemSet.delete(item);
      return true;
    }
  } else {
    const itemArray = items as T[];
    const itemIndex = itemArray.indexOf(item);
    if (itemIndex >= 0) {
      itemArray.splice(itemIndex, 1);
      return true;
    }
  }
  return false;
}
