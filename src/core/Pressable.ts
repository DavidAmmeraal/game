import { Position2D } from "./common";
import { EventEmitter } from "./EventEmitter";
import { GameEntity } from "./GameEntity";

type GConstructor<T = {}> = new (...args: any[]) => T;

export type PressableEvents = {
  "cursor-over": undefined;
  "cursor-out": undefined;
  press: undefined;
};

export function Pressable<
  T extends GConstructor<EventEmitter<PressableEvents> & GameEntity>
>(constructor: T) {
  return class extends constructor {
    cursorOver = false;
    receiveCursorMove({ x, y }: Position2D) {
      if (this.within?.({ x, y })) {
        this.emit("cursor-over");
      }
    }
  };
}
