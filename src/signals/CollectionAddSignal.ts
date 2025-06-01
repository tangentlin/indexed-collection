import { IReadonlyCollection } from '../core/IReadonlyCollection';

import { Signal } from './Signal';

export class CollectionAddSignal<T> extends Signal {
  static readonly type = Symbol('COLLECTION_ADD');
  constructor(
    target: IReadonlyCollection<T>,
    public readonly added: readonly T[]
  ) {
    super(CollectionAddSignal.type, target);
  }
}
