import { IReadonlyCollection } from '../core/IReadonlyCollection';

import { Signal } from './Signal';

export class CollectionRemoveSignal<T> extends Signal {
  static readonly type = Symbol('COLLECTION_REMOVE');
  constructor(
    target: IReadonlyCollection<T>,
    public readonly removed: readonly T[]
  ) {
    super(CollectionRemoveSignal.type, target);
  }
}
