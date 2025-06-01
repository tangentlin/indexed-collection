import { ICollectionChangeDetail } from '../core/ICollectionChangeDetail';
import { IReadonlyCollection } from '../core/IReadonlyCollection';

import { Signal } from './Signal';

export class CollectionChangeSignal<T> extends Signal {
  static readonly type = Symbol('COLLECTION_CHANGE');
  constructor(
    target: IReadonlyCollection<T>,
    public readonly detail: Readonly<ICollectionChangeDetail<T>>
  ) {
    super(CollectionChangeSignal.type, target);
  }
}
