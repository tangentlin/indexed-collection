export interface IReadonlyCollection<T> {
  exists(item: T): boolean;

  readonly items: readonly T[];

  readonly count: number;
}
