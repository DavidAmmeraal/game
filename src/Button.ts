import { Position2D } from "./core/common";
import { EventEmitter } from "./core/EventEmitter";
import { GameEntity } from "./core/GameEntity";
import { type GameEntityContext } from "./core/GameEntityContext";
import { Pressable, PressableEvents } from "./core/Pressable";

export type ButtonOptions = {
  text: string;
  padding?: number;
  position: Position2D;
};

@Pressable
export class Button
  extends EventEmitter<PressableEvents>
  implements GameEntity
{
  constructor(
    private context: GameEntityContext,
    private options: ButtonOptions
  ) {
    super();
  }

  within({ x, y }: Position2D): boolean {
    const { x: thisX, y: thisY } = this.options.position;
    const { width, height } = this.context;
    return (
      x >= thisX && x <= thisX + width && y >= thisY && y <= thisY + height
    );
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
    ctx.roundRect(
      position.x - padding,
      position.y - padding,
      textDimensions.width + padding * 2,
      height + padding * 2,
      20
    );
    ctx.fillStyle = "#bbb";
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
