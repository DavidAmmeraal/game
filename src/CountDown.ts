import { Position2D, BoundingRect } from "./core/common";
import { GameEntity } from "./core/GameEntity";
import { GameEntityContext } from "./core/GameEntityContext";
import { promiseDelegate } from "./PromiseDelegate";

export type CountDownOptions = {
  count: number;
};

export class CountDown extends GameEntity {
  private timeout: number | undefined;
  private currentNumber: number | undefined;
  constructor(
    private ctx: GameEntityContext,
    private options: CountDownOptions,
  ) {
    super();
  }

  async start() {
    const { promise, resolve } = promiseDelegate();
    let n = this.options.count;
    const next = () => {
      this.currentNumber = n;
      this.timeout = setTimeout(() => {
        n--;
        if (n !== 0) {
          next();
        } else {
          resolve();
        }
      }, 1000);
    };
    next();
    return promise;
  }

  update() {}
  render() {
    const { renderingContext: ctx } = this.ctx;
    ctx.fillStyle = "#000";
    ctx.fillText(`${this.currentNumber}`, 0, 0);
  }
  destroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
