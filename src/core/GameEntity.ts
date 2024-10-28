import { Shape } from "./Shape";

export interface GameEntity {
  update(): void;
  render(): void;
  destroy?(): void;
  getShape?(): Shape | undefined;
}
