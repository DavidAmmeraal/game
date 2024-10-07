import { BoundingRect, Position2D } from "./common";

type CollisionShape =
  | {
      type: "ball";
      radius: number;
      position: Position2D;
    }
  | ({
      type: "rect";
    } & BoundingRect);

export interface GameEntity {
  update: () => void;
  render: () => void;
  getCollisionShape?: () => CollisionShape;
  within?: (position: Position2D) => boolean;
}
