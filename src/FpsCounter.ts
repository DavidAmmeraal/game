import { GameEntityContext } from "./core/GameEntityContext";
import { GameEntity } from "./core/GameEntity";

export class FpsCounter extends GameEntity {
  constructor(private ctx: GameEntityContext) {
    super();
  }

  update() {
    return;
  }
  render() {
    this.ctx.renderingContext.fillStyle = "#000";
    this.ctx.renderingContext.fillText(
      `FPS:${this.ctx.getFps()}`,
      this.ctx.width - 100,
      50,
    );
  }
}
