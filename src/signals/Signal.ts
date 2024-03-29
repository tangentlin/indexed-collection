/**
 * Signal is a base class for all signals.
 *
 */
export abstract class Signal {
  protected constructor(
    public readonly type: symbol,
    public readonly target: unknown
  ) {}
}

export type SignalType = Signal['type'];
