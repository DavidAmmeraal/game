import { Loop } from "./Loop";
import { GetOptional } from "../typeUtils";
import { create2DCanvas } from "../utils";
import { GameScene, GameSceneContext } from "./GameScene";
import { GameStartScene } from "../GameStartScene";
import { GameEntityContext } from "./GameEntityContext";
import { GameLayer } from "./GameLayer";
import { GameEntityFactory } from "../GameEntityFactory";
import { isPressable, PressableEntity } from "./Pressable";
import { Level1Scene } from "../Level1Scene";
import { isCollidableEntity } from "./Collidable";
import { GameEntity } from "./GameEntity";

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

type GameEntityVisitor = (entity: GameEntity) => void;

export class Game {
  private viewport: HTMLCanvasElement;
  private scene: GameScene | undefined;
  private renderingContext: CanvasRenderingContext2D;
  private readonly options: Required<GameOptions>;
  private loop: Loop;
  private topLayer: GameLayer;
  private gameEntityFactory: GameEntityFactory;
  private entityTickVisitors: Set<GameEntityVisitor> = new Set();

  constructor(
    private container: HTMLElement,
    options: Readonly<GameOptions>,
  ) {
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
      this.createGameEntityContext(),
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

  tick() {
    const layers = [...(this.scene?.getLayers().values() || [])].reverse();
    for (const layer of layers) {
      for (const entity of layer) {
        this.entityTickVisitors.forEach((visitor) => visitor(entity));
      }
    }
    this.render();
  }

  setupMouseListeners() {
    const visitPressable = (callback: (entity: PressableEntity) => void) => {
      const layers = [...(this.scene?.getLayers().values() || [])].reverse();
      for (const layer of layers) {
        for (const entity of layer) {
          if (isPressable(entity)) {
            callback(entity);
          }
        }
      }
    };

    this.container.addEventListener("mousemove", (ev) => {
      visitPressable((entity) => {
        entity.pressable.receiveCursorMove({ x: ev.offsetX, y: ev.offsetY });
      });
    });

    this.container.addEventListener("click", (ev) => {
      visitPressable((entity) => {
        entity.pressable.receiveCursorPress({ x: ev.offsetX, y: ev.offsetY });
      });
    });

    this.container.addEventListener("mousedown", (ev) => {
      visitPressable((entity) => {
        entity.pressable.receiveCursorDown({ x: ev.offsetX, y: ev.offsetY });
      });
    });

    this.container.addEventListener("mouseup", (ev) => {
      visitPressable((entity) => {
        entity.pressable.receiveCursorUp({ x: ev.offsetX, y: ev.offsetY });
      });
    });
  }

  setupCollisions() {
    this.entityTickVisitors.add((entity) => {
      if (isCollidableEntity(entity)) {
        for (const [, layer] of this.scene?.getLayers() || []) {
          for (const otherEntity of layer) {
            if (isCollidableEntity(otherEntity)) {
              if (otherEntity.collisions.collides(entity)) {
                entity.collisions.events.emit("collision", otherEntity);
              }
            }
          }
        }
      }
    });
  }

  render() {
    this.renderingContext.fillStyle = "red";
    this.renderingContext.fillRect(
      0,
      0,
      this.options.width,
      this.options.height,
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
    this.entityTickVisitors.add((entity) => entity.update());
    this.setupCollisions();

    this.loop.setCallback(() => {
      this.tick();
    });
    if (this.options.showFps) {
      this.topLayer.add(this.gameEntityFactory.createFpsCounter());
    }

    const startScene = new GameStartScene(this.createGameSceneContext());
    this.scene = startScene;
    await startScene.perform();

    const level1Scene = new Level1Scene(this.createGameSceneContext());
    this.scene = level1Scene;
    await level1Scene.perform();
  }

  stop() {
    this.loop.stop();
  }
}
