import { Mixin } from "ts-mixer";
import { BoundingRect, Position2D } from "./core/common";
import { GameEntity } from "./core/GameEntity";
import { type GameEntityContext } from "./core/GameEntityContext";
import { Pressable, PressableState } from "./core/Pressable";
import { Shape } from "./core/Shape";
import { collide } from "./core/collide";

export type ButtonOptions = {
  text: string;
  padding?: number;
  position: Position2D;
};

const getFillStyle = (state?: PressableState) => {
  if (!state) return "#ddd";
  switch (state.state) {
    case "down":
      return "#aaa";
    case "over":
      return "#bbb";
    default:
      return "#ddd";
  }
};

export class Button extends Mixin(Pressable) implements GameEntity {
  private boundingBox?: BoundingRect;
  private pressableState?: PressableState;

  constructor(
    private context: GameEntityContext,
    private options: ButtonOptions,
  ) {
    super();
  }

  protected isPressableEventWithin(pos: Position2D): boolean {
    const shape = this.getShape();
    if (shape) {
      return collide({ type: "rect", ...pos, width: 0, height: 0 }, shape);
    }
    return false;
  }

  getShape(): Shape | undefined {
    if (this.boundingBox) {
      return {
        type: "rect",
        ...this.boundingBox,
      };
    }
    return undefined;
  }

  update = () => {};

  render = () => {
    const ctx = this.context.renderingContext;
    const { position, text, padding = 0 } = this.options;

    ctx.textBaseline = "hanging";
    const textDimensions = ctx.measureText(text);
    const height =
      textDimensions.actualBoundingBoxAscent +
      textDimensions.actualBoundingBoxDescent;

    ctx.beginPath();
    this.boundingBox = {
      x: position.x - padding,
      y: position.y - padding,
      width: textDimensions.width + padding * 2,
      height: height + padding * 2,
    };
    ctx.roundRect(
      this.boundingBox.x,
      this.boundingBox.y,
      this.boundingBox.width,
      this.boundingBox.height,
      20,
    );
    ctx.fillStyle = getFillStyle(this.pressableState);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

    ctx.fillStyle = "#000";
    ctx.fillText(
      this.options.text,
      position.x,
      position.y,
      textDimensions.width,
    );
  };
}
