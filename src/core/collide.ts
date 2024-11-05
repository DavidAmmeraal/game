import { Collidable, CollidableEntity } from "./Collidable";
import { Position2D } from "./common";
import { RectShape, CircleShape, Shape } from "./Shape";

function collideRectWithCircle(
  { x: rx, y: ry, width: rw, height: rh }: RectShape,
  { position: { x: cx, y: cy }, radius }: CircleShape,
) {
  // temporary variables to set edges for testing
  let testX = cx;
  let testY = cy;

  // which edge is closest?
  if (cx < rx)
    testX = rx; // test left edge
  else if (cx > rx + rw) testX = rx + rw; // right edge
  if (cy < ry)
    testY = ry; // top edge
  else if (cy > ry + rh) testY = ry + rh; // bottom edge

  // get distance from closest edges
  const distX = cx - testX;
  const distY = cy - testY;
  const distance = Math.sqrt(distX * distX + distY * distY);

  // if the distance is less than the radius, collision!
  if (distance <= radius) {
    return true;
  }
  return false;
}

function euclidianDistance(
  { x: x1, y: y1 }: Position2D,
  { x: x2, y: y2 }: Position2D,
) {
  //d = √[(x2 − x1)^2 + (y2 − y1)^2]
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function collideCircles(a: CircleShape, b: CircleShape) {
  /*
   * Two circles will touch if the distance between their centres,
   * is equal to the sum of their radii, or the difference between their radii.
   */
  const dist = euclidianDistance(a.position, b.position);
  return a.radius - b.radius < dist && a.radius + b.radius > dist;
}

function collideRects(
  { x: x1, y: y1, width: w1, height: h1 }: RectShape,
  { x: x2, y: y2, width: w2, height: h2 }: RectShape,
) {
  return (
    x1 + w1 >= x2 && // r1 right edge past r2 left
    x1 <= x2 + w2 && // r1 left edge past r2 right
    y1 + h1 >= y2 && // r1 top edge past r2 bottom
    y1 <= y2 + h2
  );
}

export function collide(a: Shape, b: Shape): boolean {
  if (a.type === "circle" && b.type === "circle") {
    return collideCircles(a, b);
  }

  if (a.type === "rect" && b.type === "rect") {
    return collideRects(a, b);
  }

  if (a.type === "rect" && b.type === "circle") {
    return collideRectWithCircle(a, b);
  }

  if (b.type === "rect" && a.type === "circle") {
    return collideRectWithCircle(b, a);
  }

  return false;
}
