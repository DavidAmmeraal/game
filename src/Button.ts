import { BoundingRect, Position2D } from "./core/common";
import { EventEmitter } from "./core/EventEmitter";
import { GameEntity } from "./core/GameEntity";
import { type GameEntityContext } from "./core/GameEntityContext";
import { Pressable, PressableEvents, PressableState } from "./core/Pressable";
import { withinRect } from "./utils";

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

@Pressable
export class Button
  extends EventEmitter<PressableEvents>
  implements GameEntity
{
  private boundingBox?: BoundingRect;
  private pressableState?: PressableState;

  constructor(
    private context: GameEntityContext,
    private options: ButtonOptions
  ) {
    super();
    this.on("cursor-state-change", (state) => (this.pressableState = state));
  }

  within({ x, y }: Position2D): boolean {
    if (this.boundingBox) return withinRect({ x, y }, this.boundingBox);
    return false;
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
      20
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
      textDimensions.width
    );
  };
}
