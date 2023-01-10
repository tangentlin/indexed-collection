import { KeyExtract } from '../core/KeyExtract';
import { IndexBase } from './IndexBase';
import { ICollectionOption } from '../core/ICollectionOption';
import { defaultCollectionOption } from '../core/defaultCollectionOption';

export class TwoLevelIndex<T, Key1T, Key2T> extends IndexBase<T> {
  constructor(
    key1Fn: KeyExtract<T, Key1T>,
    key2Fn: KeyExtract<T, Key2T>,
    option: Readonly<ICollectionOption> = defaultCollectionOption
  ) {
    super([key1Fn, key2Fn], option);
  }

  public getValue(key1: Key1T, key2: Key2T): readonly T[] {
    return super.getValueInternal([key1, key2]);
  }
}
