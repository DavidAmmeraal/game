import { BoundingRect } from "./core/common";
import { GameEntity } from "./core/GameEntity";
import { translateX } from "./utils";

export type PongPadOptions = {
  context: CanvasRenderingContext2D;
  rect: BoundingRect;
  bounds: [left: number, right: number];
  onBounce: () => void;
};

const resolveKey = (ev: KeyboardEvent) => {
  switch (ev.key) {
    case "ArrowLeft":
      return "left";
    case "ArrowRight":
      return "right";
  }
  return undefined;
};

export class PongPad implements GameEntity {
  private keyPressed: "left" | "right" | undefined;
  private minLeft: number;
  private maxLeft: number;

  private rect: BoundingRect;

  private downListener = (ev: KeyboardEvent) => {
    this.keyPressed = resolveKey(ev);
  };

  private upListener = (ev: KeyboardEvent) => {
    this.keyPressed =
      resolveKey(ev) === this.keyPressed ? undefined : this.keyPressed;
  };

  constructor(private options: PongPadOptions) {
    const [minLeft, rightBound] = this.options.bounds;
    this.rect = { ...options.rect };

    this.minLeft = minLeft;
    this.maxLeft = rightBound - this.rect.width;
  }

  get shape() {
    return {
      type: "rect" as const,
      ...this.rect,
    };
  }

  render = () => {
    this.options.context.fillStyle = "#000";
    this.options.context.fillRect(
      this.rect.x,
      this.rect.y,
      this.rect.width,
      this.rect.height,
    );

    this.attach.bind(this);
    this.detach.bind(this);
  };

  attach() {
    window.addEventListener("keydown", this.downListener);
    window.addEventListener("keyup", this.upListener);
  }

  detach() {
    window.removeEventListener("keydown", this.downListener);
    window.removeEventListener("keyup", this.upListener);
  }

  update = () => {
    let newRect = this.rect;
    switch (this.keyPressed) {
      case "left":
        newRect = translateX(this.rect, -5);
        break;
      case "right":
        newRect = translateX(this.rect, 5);
        break;
    }
    const { x, y, width, height } = newRect;
    this.rect = {
      x: Math.min(this.maxLeft, Math.max(x, this.minLeft)),
      y,
      width,
      height,
    };
  };
}
