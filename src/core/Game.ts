import { Loop } from "./Loop";
import { GetOptional } from "../typeUtils";
import { create2DCanvas } from "../utils";
import { GameScene, GameSceneContext } from "./GameScene";
import { GameStartScene } from "../GameStartScene";
import { GameEntityContext } from "./GameEntityContext";
import { GameLayer } from "./GameLayer";
import { GameEntityFactory } from "../GameEntityFactory";
import { isPressableEntity, PressableEntity } from "./Pressable";

type GameOptions = {
  width: number;
  height: number;
  targetFps?: number;
  showFps?: boolean;
};

const defaultGameOptions: Required<GetOptional<GameOptions>> = {
  targetFps: 60,
  showFps: false,
};

export class Game {
  private viewport: HTMLCanvasElement;
  private scene: GameScene | undefined;
  private renderingContext: CanvasRenderingContext2D;
  private readonly options: Required<GameOptions>;
  private loop: Loop;
  private topLayer: GameLayer;
  private gameEntityFactory: GameEntityFactory;

  constructor(private container: HTMLElement, options: Readonly<GameOptions>) {
    this.options = { ...defaultGameOptions, ...options };
    const { width, height } = this.options;
    const { canvas, context } = create2DCanvas(width, height);

    this.viewport = canvas;
    this.renderingContext = context;
    this.renderingContext.save();

    this.container.appendChild(this.viewport);
    this.topLayer = new Set();

    this.loop = new Loop(this.options.targetFps);
    this.gameEntityFactory = new GameEntityFactory(
      this.createGameEntityContext()
    );
    this.setupRenderingContext();
    this.setupMouseListeners();
  }

  private setupRenderingContext() {
    const ctx = this.renderingContext;
    ctx.font = "bold 14px arial";
    ctx.textBaseline = "top";

    ctx.save();
  }

  private createGameSceneContext(): GameSceneContext {
    return {
      width: this.options.width,
      height: this.options.height,
      renderingContext: this.renderingContext,
      entityFactory: this.gameEntityFactory,
    };
  }

  private createGameEntityContext(): GameEntityContext {
    return {
      getFps: () => this.loop.state.fps,
      renderingContext: this.renderingContext,
      width: this.options.width,
      height: this.options.height,
    };
  }

  update() {
    for (const layer of this.scene?.getLayers() || []) {
      for (const entity of layer[1]) {
        entity.update();
      }
    }

    for (const entity of this.topLayer) {
      entity.update();
    }
  }

  setupMouseListeners() {
    const visitPressable = (callback: (entity: PressableEntity) => void) => {
      const layers = [...(this.scene?.getLayers().values() || [])].reverse();
      for (const layer of layers) {
        for (const entity of layer) {
          if (isPressableEntity(entity)) {
            callback(entity);
          }
        }
      }
    };

    this.container.addEventListener("mousemove", (ev) => {
      visitPressable((entity) => {
        entity.receiveCursorMove({ x: ev.offsetX, y: ev.offsetY });
      });
    });

    this.container.addEventListener("click", (ev) => {
      visitPressable((entity) => {
        entity.receiveCursorPress({ x: ev.offsetX, y: ev.offsetY });
      });
    });

    this.container.addEventListener("mousedown", (ev) => {
      visitPressable((entity) => {
        entity.receiveCursorDown({ x: ev.offsetX, y: ev.offsetY });
      });
    });

    this.container.addEventListener("mouseup", (ev) => {
      visitPressable((entity) => {
        entity.receiveCursorUp({ x: ev.offsetX, y: ev.offsetY });
      });
    });
  }

  render() {
    this.renderingContext.fillStyle = "red";
    this.renderingContext.fillRect(
      0,
      0,
      this.options.width,
      this.options.height
    );

    for (const layer of this.scene?.getLayers() || []) {
      for (const entity of layer[1]) {
        this.renderingContext.save();
        entity.render();
        this.renderingContext.restore();
      }
    }

    for (const entity of this.topLayer) {
      entity.render();
    }
  }

  async start() {
    this.loop.start();
    this.loop.setCallback(() => {
      this.update();
      this.render();
    });
    if (this.options.showFps) {
      this.topLayer.add(this.gameEntityFactory.createFpsCounter());
    }

    const startScene = new GameStartScene(this.createGameSceneContext());
    this.scene = startScene;
    await startScene.perform();
  }

  /*
  start() {
    new GameStartScene();
    const { width, height } = this.options;

    const padWidth = width / 4;
    const padHeight = height / 40;

    this.playerPad = new PongPad({
      context: this.context,
      rect: {
        x: width / 2 - padWidth / 2,
        y: height - padHeight,
        width: padWidth,
        height: padHeight,
      },
      bounds: [0, width],
    });

    const ball = new Ball({
      context: this.context,
      radius: width / 40,
      position: {
        x: width / 2,
        y: height / 2 - width / 20 / 2,
      },
      bounds: { width, height },
      velocity: 2,
      collisionEntities: this.state.entities,
    });

    this.addEntity("playerPad", this.playerPad);
    this.addEntity("ball", ball);

    this.loop.start();
  }
  */

  stop() {
    this.loop.stop();
  }
}
