import { Ball, BallOptions } from "./Ball";
import { Button, ButtonOptions } from "./Button";
import { GameEntityContext } from "./core/GameEntityContext";
import { CountDown, CountDownOptions } from "./CountDown";
import { FpsCounter } from "./FpsCounter";
import { PongPad, PongPadOptions } from "./PongPad";

export class GameEntityFactory {
  constructor(private ctx: GameEntityContext) {}

  createBall(ballOptions: BallOptions) {
    const ball = new Ball(ballOptions);
    return ball;
  }

  createFpsCounter() {
    return new FpsCounter(this.ctx);
  }

  createButton(options: ButtonOptions) {
    return new Button(this.ctx, options);
  }

  createPongPad(options: PongPadOptions) {
    return new PongPad(options);
  }

  createCountDown(options: CountDownOptions) {
    return new CountDown(this.ctx, options);
  }
}
