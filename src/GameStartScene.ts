import { GameLayer } from "./core/GameLayer";
import { GameScene, GameSceneContext } from "./core/GameScene";
import { PressableState } from "./core/Pressable";

export class GameStartScene extends GameScene {
  private bottomLayer: GameLayer;
  private topLayer: GameLayer;

  constructor(ctx: GameSceneContext) {
    super(ctx);

    this.bottomLayer = this.createLayer(0);
    this.topLayer = this.createLayer(1);
  }

  async perform() {
    const radius = this.ctx.width / 50;

    this.bottomLayer.add(
      this.ctx.entityFactory.createBall({
        position: {
          x: 0 + radius,
          y: 0 + radius,
        },
        radius,
        bounds: {
          width: this.ctx.width,
          height: this.ctx.height,
        },
        collisionEntities: new Map(),
        velocity: this.ctx.width / 200,
        renderingContext: this.ctx.renderingContext,
      })
    );

    const button = this.ctx.entityFactory.createButton({
      text: "Start game",
      position: { x: 50, y: 50 },
      padding: 5,
    });

    button.on("cursor-state-change", (state: PressableState) => {
      console.log(JSON.stringify(state, null, 2));
    });

    button.on("press", () => {
      console.log("button pressed!");
    });

    button.on("over", () => {
      console.log("button hovered!");
    });

    button.on("down", () => {
      console.log("button down!");
    });

    button.on("up", () => {
      console.log("button up!");
    });

    this.topLayer.add(button);
  }
}
