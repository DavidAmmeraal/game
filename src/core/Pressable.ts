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

export interface PressableEntity extends GameEntity {
  pressable: {
    receiveCursorMove: (pos: Position2D) => void;
    receiveCursorDown: (pos: Position2D) => void;
    receiveCursorPress: (pos: Position2D) => void;
    receiveCursorUp: (pos: Position2D) => void;
  };
}

export function PressableMixin<
  T extends abstract new (...args: any[]) => GameEntity,
>(Base: T) {
  abstract class PressableMixin extends Base implements PressableEntity {
    private _cursorState: PressableState = {
      state: "idle",
    };

    get cursorState() {
      return { ...this._cursorState };
    }

    private setState(state: PressableState) {
      this._cursorState = { ...state };
      this.emitStateChange();
    }

    private emitStateChange() {
      this.pressable.events.emit("cursor-state-change", this._cursorState);
    }

    abstract isPressableEventWithin(pos: Position2D): boolean;

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
        console.debug("receive cursor down");
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
    destroy = () => {
      super.destroy?.();
      this.pressable.events.clear("cursor-state-change");
      this.pressable.events.clear("over");
      this.pressable.events.clear("down");
      this.pressable.events.clear("press");
      this.pressable.events.clear("up");
    };
  }
  return PressableMixin;
}

export function isPressable(entity: GameEntity): entity is PressableEntity {
  return "pressable" in entity;
}
