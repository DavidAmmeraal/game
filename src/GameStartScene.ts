import { GameLayer } from "./core/GameLayer";
import { GameScene, GameSceneContext } from "./core/GameScene";
import { promiseDelegate } from "./PromiseDelegate";

export class GameStartScene extends GameScene {
  private bottomLayer: GameLayer;
  private topLayer: GameLayer;

  constructor(ctx: GameSceneContext) {
    super(ctx);

    this.bottomLayer = this.createLayer(0);
    this.topLayer = this.createLayer(1);
  }

  perform() {
    const radius = this.ctx.width / 50;

    const { resolve, promise } = promiseDelegate();

    const ball = this.ctx.entityFactory.createBall({
      position: {
        x: 0 + radius,
        y: 0 + radius,
      },
      radius,
      bounds: {
        width: this.ctx.width,
        height: this.ctx.height,
      },
      velocity: this.ctx.width / 200,
      renderingContext: this.ctx.renderingContext,
    });

    this.bottomLayer.add(ball);

    const button = this.ctx.entityFactory.createButton({
      text: "Start game",
      position: { x: this.ctx.width / 2, y: this.ctx.height / 2 },
      padding: 5,
    });

    this.topLayer.add(button);

    button.pressable.events.on("press", () => {
      resolve();
    });

    return promise;
  }
}
