import { ISignalObserver, SignalHandler } from './ISignalObserver';
import { Signal, SignalType } from './Signal';

export class SignalObserver implements ISignalObserver {
  private readonly typeToHandleMap: Map<SignalType, Set<SignalHandler<Signal>>>;
  private handlerToTypeMap: Map<
    SignalHandler<Signal>,
    Set<SignalType>
  > = new Map();
  constructor() {
    this.typeToHandleMap = new Map();
  }
  notifyObservers(signal: Signal): void {
    const handlers = this.typeToHandleMap.get(signal.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(signal);
      }
    }
  }

  registerObserver<T extends Signal>(
    type: symbol,
    handler: SignalHandler<T>
  ): void {
    const handlers = this.typeToHandleMap.get(type) ?? new Set();
    // @ts-ignore
    handlers.add(handler);
    this.typeToHandleMap.set(type, handlers);

    // @ts-ignore
    const types = this.handlerToTypeMap.get(handler) ?? new Set();
    types.add(type);
    // @ts-ignore
    this.handlerToTypeMap.set(handler, type);
  }

  unregisterObserver<T extends Signal>(
    handler: SignalHandler<T>,
    type?: symbol
  ): void {
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
