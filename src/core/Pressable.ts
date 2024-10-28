import { hasMixin } from "ts-mixer";
import { Position2D } from "./common";
import { EventEmitter } from "./EventEmitter";
import { GameEntity } from "./GameEntity";

export type PressableState =
  | { state: "idle" }
  | {
      state: "over" | "down";
      position: Position2D;
    };

export type PressableEvents = {
  "cursor-state-change": [PressableState];
  over: [PressableState];
  out: [PressableState];
  down: [PressableState];
  press: [PressableState];
  up: [PressableState];
};

export abstract class Pressable {
  private _cursorState: PressableState = {
    state: "idle",
  };

  get cursorState() {
    return { ...this._cursorState };
  }

  pressable = {
    events: new EventEmitter<PressableEvents>(),
    receiveCursorMove: ({ x, y }: Position2D) => {
      if (this.isPressableEventWithin?.({ x, y })) {
        if (this._cursorState.state === "idle") {
          this.setState({ state: "over", position: { x, y } });
          this.pressable.events.emit("over", this._cursorState);
          return;
        }
      } else {
        if (this._cursorState.state === "over") {
          this.setState({ state: "idle" });
          this.pressable.events.emit("out", this._cursorState);
        }
      }
    },
    receiveCursorDown: ({ x, y }: Position2D) => {
      if (this.isPressableEventWithin?.({ x, y })) {
        this.setState({ state: "down", position: { x, y } });
      }
    },
    receiveCursorPress: ({ x, y }: Position2D) => {
      if (this.isPressableEventWithin?.({ x, y })) {
        this.pressable.events.emit("press", this._cursorState);
      }
    },
    receiveCursorUp: ({ x, y }: Position2D) => {
      this.pressable.events.emit("up", this._cursorState);

      if (this.isPressableEventWithin?.({ x, y })) {
        this.setState({ state: "over", position: { x, y } });
      } else {
        this.setState({ state: "idle" });
      }
    },
  };

  private setState(state: PressableState) {
    this._cursorState = { ...state };
    this.emitStateChange();
  }

  private emitStateChange() {
    this.pressable.events.emit("cursor-state-change", this._cursorState);
  }

  protected abstract isPressableEventWithin(pos: Position2D): boolean;

  destroy = () => {
    this.pressable.events.clear("cursor-state-change");
    this.pressable.events.clear("over");
    this.pressable.events.clear("down");
    this.pressable.events.clear("press");
    this.pressable.events.clear("up");
  };
}

export function isPressable(entity: unknown): entity is Pressable {
  return hasMixin(entity, Pressable);
}
