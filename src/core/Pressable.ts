import { Position2D } from "./common";
import { EventEmitter } from "./EventEmitter";
import { GameEntity } from "./GameEntity";

type GConstructor<T = {}> = new (...args: any[]) => T;

export type PressableState =
  | { state: "idle" }
  | {
      state: "over" | "down" | "up";
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
  receiveCursorMove: (position: Position2D) => void;
  receiveCursorPress: (position: Position2D) => void;
  receiveCursorDown: (position: Position2D) => void;
  receiveCursorUp: (position: Position2D) => void;
}

export function Pressable<
  T extends GConstructor<EventEmitter<PressableEvents> & GameEntity>
>(constructor: T) {
  return class extends constructor implements PressableEntity {
    _cursorState: PressableState = {
      state: "idle",
    };

    get cursorState() {
      return { ...this._cursorState };
    }

    setState(state: PressableState) {
      this._cursorState = { ...state };
      this.emitStateChange();
    }

    emitStateChange() {
      this.emit("cursor-state-change", this._cursorState);
    }
    receiveCursorMove({ x, y }: Position2D) {
      if (this.within?.({ x, y })) {
        if (this._cursorState.state === "idle") {
          this.setState({ state: "over", position: { x, y } });
          this.emit("over", this._cursorState);
          return;
        }
      } else {
        if (this._cursorState.state === "over") {
          this.setState({ state: "idle" });
          this.emit("out", this._cursorState);
        }
      }
    }
    receiveCursorDown({ x, y }: Position2D) {
      if (this.within?.({ x, y })) {
        this.setState({ state: "down", position: { x, y } });
      }
    }
    receiveCursorPress({ x, y }: Position2D) {
      if (this.within?.({ x, y })) {
        this.emit("press", this._cursorState);
      }
    }
    receiveCursorUp({ x, y }: Position2D) {
      this.emit("up", this._cursorState);

      if (this.within?.({ x, y })) {
        this.setState({ state: "over", position: { x, y } });
      } else {
        this.setState({ state: "idle" });
      }
    }
    destroy = () => {
      super.destroy?.();
      this.clear("cursor-state-change");
      this.clear("over");
      this.clear("down");
      this.clear("press");
      this.clear("up");
    };
  };
}

export function isPressableEntity(
  entity: GameEntity
): entity is PressableEntity {
  return "receiveCursorMove" in entity;
}
