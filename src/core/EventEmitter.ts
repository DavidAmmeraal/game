export type EventMap = {
  [eventName: string]: any[];
};

type Listener = (...args: any[]) => void;

type DefaultEventMap = {
  "$0": [never]


}

type OptionalPropertyNames<T> =
  { [K in keyof T]-?: ({} extends { [P in K]: T[K] } ? K : never) }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> =
  { [P in K]: L[P] | Exclude<R[P], undefined> };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never

type SpreadTwo<L, R> = Id<
  & Pick<L, Exclude<keyof L, keyof R>>
  & Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>>
  & Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>>
  & SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type Spread<A extends readonly [...any]> = A extends [infer L, ...infer R] ?
  SpreadTwo<L, Spread<R>> : unknown

export type MergedEventEmitter<
  TEventEmitter extends EventEmitter,
  TEventMap extends EventMap,
> =
  TEventEmitter extends EventEmitter<infer BaseEventMap> ?
    BaseEventMap extends never ? EventEmitter<TEventMap> : EventEmitter<Spread<[BaseEventMap, TEventMap]>> 
     : EventEmitter<TEventMap>;


export interface EventEmitter<TEventMap extends EventMap = DefaultEventMap> {
  on<K extends keyof TEventMap>(
    eventName: K,
    listener: (...parameters: TEventMap[K]) => void,
  ): void;
  emit<K extends keyof TEventMap>(
    ...args: TEventMap[K] extends void ? [K] : [K, ...TEventMap[K]]
  ): void;
  off<K extends keyof TEventMap>(eventName: K, listener: Listener): void;
  clear<K extends keyof TEventMap>(eventName: K): void;
}

export class EventEmitter<TEventMap extends EventMap = DefaultEventMap> {
  private listeners: Map<keyof TEventMap, Set<Listener>> = new Map();

  constructor() {}

  on<K extends keyof TEventMap>(
    eventName: K,
    listener: (...parameters: TEventMap[K]) => void,
  ) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName)!.add(listener);
  }

  emit<K extends keyof TEventMap>(
    ...args: TEventMap[K] extends void ? [K] : [K, ...TEventMap[K]]
  ) {
    const [eventName, ...params] = args;
    if (!this.listeners.has(eventName)) return;
    this.listeners.get(eventName)!.forEach((listener) => listener(...params));
  }

  off<K extends keyof TEventMap>(eventName: K, listener: Listener) {
    if (!this.listeners.has(eventName)) return;
    this.listeners.get(eventName)!.delete(listener);
  }

  clear<K extends keyof TEventMap>(eventName: K) {
    if (!this.listeners.has(eventName)) return;
    this.listeners.get(eventName)!.clear();
  }
}
