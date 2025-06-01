import { ICollectionUpdateLineItem } from '../core/ICollectionChangeDetail';
import { IReadonlyCollection } from '../core/IReadonlyCollection';

import { Signal } from './Signal';

export class CollectionUpdateSignal<T> extends Signal {
  static readonly type = Symbol('COLLECTION_UPDATE');
  constructor(
    target: IReadonlyCollection<T>,
    public readonly updated: readonly Readonly<ICollectionUpdateLineItem<T>>[]
  ) {
    super(CollectionUpdateSignal.type, target);
  }
}
