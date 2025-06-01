import { CollectionNature } from '../core/CollectionNature';
import { ICollectionOption } from '../core/ICollectionOption';
import { KeyExtract } from '../core/KeyExtract';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { IInternalList } from '../core/internals/IInternalList';
import { InternalList } from '../core/internals/InternalList';
import { InternalSetList } from '../core/internals/InternalSetList';

const emptyArray = Object.freeze([]);

type SetOrArray<T> = Set<T> | T[];
type LeafMap<T, KeyT = unknown> = Map<KeyT, IInternalList<T>>;

export abstract class IndexBase<T> {
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

    for (const leafMap of leafMaps) {
      for (const key of lastKeys) {
        const result = removeItemFromMap(key, item, leafMap);
        removed = removed || result;
      }
    }

    return removed;
  }

  protected getValueInternal(keys: readonly unknown[]): readonly T[] {
    const convertedKeys = keys.map(k => [k]);
    const leafMaps = this.getLeafMaps(convertedKeys);
    const lastKey = keys[keys.length - 1];
    const values = leafMaps[0]?.get(lastKey);
    if (values == null) {
      return emptyArray;
    }

    return values.output;
  }

  protected getKeys(item: T): SetOrArray<unknown>[] {
    // @ts-ignore
    return this._keyFns.map(keyFn => {
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

function getNewInternalList<T>(isUsingSet: boolean): IInternalList<T> {
  return isUsingSet ? new InternalSetList(new Set()) : new InternalList([]);
}

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

function removeItemFromMap<T>(key: unknown, item: T, map: LeafMap<T>): boolean {
  const items = map.get(key) as IInternalList<T>;
  if (items.exists(item)) {
    items.remove(item);
    return true;
  }
  return false;
}
