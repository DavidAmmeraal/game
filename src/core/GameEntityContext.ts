export interface GameEntityContext {
  readonly getFps: () => number;
  readonly renderingContext: CanvasRenderingContext2D;
  readonly width: number;
  readonly height: number;
}
