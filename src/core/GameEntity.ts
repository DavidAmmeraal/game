import { Shape } from "./Shape";

export interface GameEntity {
  update(): void;
  render(): void;
  destroy?(): void;
}

export abstract class GameEntity implements GameEntity {}
