import { Position2D } from "./core/common";

export function create2DCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Couldn't create Canvas!");

  const pixelRatio = window.devicePixelRatio;

  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  // Scale the context so we get accurate pixel density
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return { canvas, context };
}

export function translateX<T extends Position2D>(
  { x, ...rest }: T,
  amount: number
): T {
  return { x: x + amount, ...rest } as T;
}

type BoundingRect = {
  x: number;
  y: number;
};

export function overlaps(a: BoundingRect) {}