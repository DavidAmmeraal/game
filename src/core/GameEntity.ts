import { BoundingRect, Position2D } from "./common";
import { EventEmitter, EventMap } from "./EventEmitter";
import { Shape } from "./Shape";

export interface GameEntity {
  update(): void;
  render(): void;
  destroy?(): void;
  readonly shape: Shape;
}

export class GameEntity {

}