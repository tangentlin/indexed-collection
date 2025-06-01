import { ISignalObserver, SignalHandler } from './ISignalObserver';
import { Signal, SignalType } from './Signal';

/**
 * Signal observer is a class that can be used to observe signals
 * It supports multiple observers for a single signal type and vice versa
 */
export class SignalObserver implements ISignalObserver {
  private readonly typeToHandleMap: Map<SignalType, Set<SignalHandler<Signal>>>;
  private handlerToTypeMap: Map<SignalHandler<Signal>, Set<SignalType>> = new Map();
  constructor() {
    this.typeToHandleMap = new Map();
  }

  /**
   * Notify all observers of a signal by the signal's type
   * @param signal
   */
  notifyObservers(signal: Signal): void {
    const handlers = this.typeToHandleMap.get(signal.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(signal);
      }
    }
  }

  /**
   * Register an observer for a signal type
   * @param type The type of a signal
   * @param handler The handler to be called when the signal is emitted
   */
  registerObserver<T extends Signal>(type: symbol, handler: SignalHandler<T>): void {
    const handlers = this.typeToHandleMap.get(type) ?? new Set();
    // @ts-ignore
    handlers.add(handler);
    this.typeToHandleMap.set(type, handlers);

    // @ts-ignore
    const types = this.handlerToTypeMap.get(handler) ?? new Set();
    types.add(type);
    // @ts-ignore
    this.handlerToTypeMap.set(handler, types);
  }

  /**
   * Unregister an observer for a signal type
   * @param handler The handle to be unregistered
   * @param type (Optional) The type of a signal (if not provided, all types associated with the handle will be unregistered)
   */
  unregisterObserver<T extends Signal>(handler: SignalHandler<T>, type?: symbol): void {
    let relevantSignalTypes: Set<SignalType>;
    if (type == null) {
      // @ts-ignore
      relevantSignalTypes = this.handlerToTypeMap.get(handler);
    } else {
      relevantSignalTypes = new Set([type]);
    }

    for (const type of relevantSignalTypes) {
      const handlers = this.typeToHandleMap.get(type);
      if (handlers) {
        // @ts-ignore
        handlers.delete(handler);
      }
    }

    // @ts-ignore
    this.handlerToTypeMap.delete(handler);
  }
}
