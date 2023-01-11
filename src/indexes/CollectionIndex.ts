import { KeyExtract } from '../core/KeyExtract';
import { IndexBase } from './IndexBase';
import { ICollectionOption } from '../core/ICollectionOption';
import { defaultCollectionOption } from '../core/defaultCollectionOption';

type KeyTypeArray = ReadonlyArray<unknown>;

type KeyExtractArray<T, KeysT extends KeyTypeArray> = {
  [index in keyof KeysT]: KeyExtract<T, KeysT[index]>;
};

export class CollectionIndex<T, KeysT extends KeyTypeArray> extends IndexBase<
  T
> {
  constructor(
    keyFn: KeyExtractArray<T, KeysT>,
    option: Readonly<ICollectionOption> = defaultCollectionOption
  ) {
    super(keyFn, option);
  }

  public getValue(...keys: KeysT): readonly T[] {
    return super.getValueInternal(keys);
  }
}
