import { Signal } from './Signal';

export type SignalHandler<T extends Signal> = (signal: T) => void;

export interface ISignalObserver {
  registerObserver<T extends Signal>(signalType: symbol, handler: SignalHandler<T>): void;
  unregisterObserver<T extends Signal>(handler: SignalHandler<T>, signalType?: symbol): void;
  notifyObservers(signal: Signal): void;
}
