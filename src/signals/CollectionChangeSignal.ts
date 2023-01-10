import { Signal } from './Signal';
import { IReadonlyCollection } from '../core/IReadonlyCollection';

export class CollectionChangeSignal<T> extends Signal {
  static readonly type = Symbol('COLLECTION_CHANGE');
  constructor(target: IReadonlyCollection<T>) {
    super(CollectionChangeSignal.type, target);
  }
}
