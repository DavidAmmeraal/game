import { Ball } from "./Ball";
import { GameLayer } from "./core/GameLayer";
import { GameScene, GameSceneContext } from "./core/GameScene";
import { promiseDelegate } from "./PromiseDelegate";

export class Level1Scene extends GameScene {
  private layer: GameLayer;
  private ball?: Ball;
  constructor(context: GameSceneContext) {
    super(context);
    this.layer = this.createLayer(0);
  }

  async nextGame(): Promise<void> {
    const { promise, resolve } = promiseDelegate<void>();
    const countdown = this.ctx.entityFactory.createCountDown({ count: 5 });
    if (this.ball) {
      this.layer.delete(this.ball);
    }

    this.layer.add(countdown);
    await countdown.start();
    this.layer.delete(countdown);
    console.log("doing this");
    countdown.destroy();

    const radius = this.ctx.width / 50;

    this.ball = this.ctx.entityFactory.createBall({
      position: {
        x: 0 + radius,
        y: 0 + radius,
      },
      radius,
      bounds: {
        width: this.ctx.width,
        height: this.ctx.height,
      },
      collisionEntities: this.layer,
      velocity: this.ctx.width / 200,
      renderingContext: this.ctx.renderingContext,
      checkOutOfBounds: (position) => {
        return position.y + radius >= this.ctx.height;
      },
      onOutOfBounds: () => {
        console.log("resolving");
        resolve();
      },
    });
    this.ball.collisions.events.on("collision", (entity) => {
      if (entity === this.ball) return;
      this.ball?.collisions.events.emit("collision", entity);
    })
    this.layer.add(this.ball);
    return promise;
  }

  async showLostMessage() {}

  async perform(): Promise<void> {
    const { resolve, promise } = promiseDelegate();

    const pad = this.ctx.entityFactory.createPongPad({
      rect: {
        x: this.ctx.width / 2 - this.ctx.width / 4 / 2,
        y: this.ctx.height - this.ctx.height / 10,
        width: this.ctx.width / 4,
        height: this.ctx.height / 10,
      },
      context: this.ctx.renderingContext,
      bounds: [0, this.ctx.width],
    });

    this.layer.add(pad);
    pad.attach();

    let lifes = 3;

    while (lifes >= 0) {
      await this.nextGame();
      lifes--;
    }

    return promise;
  }
}
