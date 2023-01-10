import { KeyExtract } from '../core/KeyExtract';
import { IndexBase } from './IndexBase';
import { ICollectionOption } from '../core/ICollectionOption';
import { defaultCollectionOption } from '../core/defaultCollectionOption';

export class OneLevelIndex<T, KeyT> extends IndexBase<T> {
  constructor(
    keyFn: KeyExtract<T, KeyT>,
    option: Readonly<ICollectionOption> = defaultCollectionOption
  ) {
    super([keyFn], option);
  }

  public getValue(key: KeyT): readonly T[] {
    return super.getValueInternal([key]);
  }
}
