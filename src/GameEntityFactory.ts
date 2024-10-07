import { Ball, BallOptions } from "./Ball";
import { Button, ButtonOptions } from "./Button";
import { GameEntityContext } from "./core/GameEntityContext";
import { FpsCounter } from "./FpsCounter";

export class GameEntityFactory {
  constructor(private ctx: GameEntityContext) {}

  createBall(ballOptions: BallOptions) {
    return new Ball(this.ctx, ballOptions);
  }

  createFpsCounter() {
    return new FpsCounter(this.ctx);
  }

  createButton(options: ButtonOptions) {
    return new Button(this.ctx, options);
  }
}
