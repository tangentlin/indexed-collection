import { KeyExtract } from '../core/KeyExtract';
import { IndexBase } from './IndexBase';
import { ICollectionOption } from '../core/ICollectionOption';
import { defaultCollectionOption } from '../core/defaultCollectionOption';

export class ThreeLevelIndex<T, Key1T, Key2T, Key3T> extends IndexBase<T> {
  constructor(
    key1Fn: KeyExtract<T, Key1T>,
    key2Fn: KeyExtract<T, Key2T>,
    key3Fn: KeyExtract<T, Key3T>,
    option: Readonly<ICollectionOption> = defaultCollectionOption
  ) {
    super([key1Fn, key2Fn, key3Fn], option);
  }

  public getValue(key1: Key1T, key2: Key2T, key3: Key3T): readonly T[] {
    return super.getValueInternal([key1, key2, key3]);
  }
}
