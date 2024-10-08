type EventMap = {
  [eventName: string]: any[];
};

type Listener = (...args: any[]) => void;

export class EventEmitter<TEventMap extends EventMap = EventMap> {
  private listeners: Map<keyof TEventMap, Set<Listener>> = new Map();

  constructor() {}

  on<K extends keyof TEventMap>(
    eventName: K,
    listener: (...parameters: TEventMap[K]) => void
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
