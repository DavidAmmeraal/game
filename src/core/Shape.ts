import { BoundingRect, Position2D } from "./common";

export type CircleShape = {
  type: "circle";
  radius: number;
  position: Position2D;
}

export type RectShape = ({
  type: "rect";
} & BoundingRect);

export type Shape =
  | CircleShape
  | RectShape;