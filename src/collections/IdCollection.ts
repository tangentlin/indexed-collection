import { IHasId } from '../core/IHasId';
import { IndexedCollectionBase } from './IndexedCollectionBase';
import { IIndex } from '../core/IIndex';
import { Optional } from '../core/Optional';
import { ICollectionOption } from '../core/ICollectionOption';
import { defaultCollectionOption } from '../core/defaultCollectionOption';
import { OneLevelIndex } from '../indexes/OneLevelIndex';

export class IdCollection<
  T extends IHasId<IdT>,
  IdT = string
> extends IndexedCollectionBase<T> {
  protected readonly idIndex: OneLevelIndex<T, IdT> = new OneLevelIndex(
    this.getItemId.bind(this)
  );
  constructor(
    initialValues?: readonly T[],
    additionalIndexes: ReadonlyArray<IIndex<T>> = [],
    option: Readonly<ICollectionOption> = defaultCollectionOption
  ) {
    super(undefined, undefined, option);
    this.buildIndexes([this.idIndex, ...additionalIndexes]);
    if (initialValues) {
      this.addRange(initialValues);
    }
  }
  getItemId(item: T): IdT {
    return item.id;
  }

  byId(id: IdT): Optional<T> {
    return this.idIndex.getValue(id)[0];
  }
}
