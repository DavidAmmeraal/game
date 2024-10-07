import { GameEntityFactory } from "../GameEntityFactory";
import { GameLayer } from "./GameLayer";

export interface GameSceneContext {
  width: number;
  height: number;
  renderingContext: CanvasRenderingContext2D;
  entityFactory: GameEntityFactory;
}

export abstract class GameScene {
  protected layers: Map<number, GameLayer>;
  constructor(protected ctx: GameSceneContext) {
    this.layers = new Map();
  }

  public getLayers() {
    return this.layers;
  }

  protected createLayer(elevation: number): GameLayer {
    const layer: GameLayer = new Set();
    this.layers.set(elevation, layer);

    // Sort the layers in ascending order
    this.layers = new Map([...this.layers.entries()].sort(([a], [b]) => a - b));

    return layer;
  }

  abstract perform(): Promise<void>;
}
