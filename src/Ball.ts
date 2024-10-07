import { GameEntity } from "./core/GameEntity";
import { GameEntityContext } from "./core/GameEntityContext";
import { Position2D } from "./core/common";

export type BallOptions = {
  position: Position2D;
  bounds: {
    width: number;
    height: number;
  };
  radius: number;
  renderingContext: CanvasRenderingContext2D;
  velocity: number;
  collisionEntities: Map<string, GameEntity>;
};

export class Ball implements GameEntity {
  private position;
  private dx: number;
  private dy: number;

  constructor(private ctx: GameEntityContext, private options: BallOptions) {
    this.position = options.position;
    this.dx = this.options.velocity;
    this.dy = -this.options.velocity;
  }

  getCollisionShape = () =>
    ({
      type: "ball",
      radius: this.options.radius,
      position: this.position,
    } as const);

  private checkCollisionsWithEntities() {
    for (const [, entity] of this.options.collisionEntities) {
      const shape = entity.getCollisionShape?.();
      if (!shape) continue;
      const { x, y } = this.getCollisionShape().position;
      const radius = this.getCollisionShape().radius;

      // Only colliding with pads for now
      if (shape.type === "rect") {
        const rect = shape;
        if (
          x + radius >= rect.x &&
          x + radius <= rect.x + rect.width &&
          y + radius >= rect.y &&
          y + radius <= rect.y + rect.height
        ) {
          this.dy = -this.dy;
        }
      }
    }
  }

  private checkCollisionsWithBounds() {
    const { x, y } = this.position;
    const { width, height } = this.options.bounds;
    const radius = this.options.radius;

    if (x + this.dx > width - radius || x + this.dx < radius) {
      this.dx = -this.dx;
    }
    if (y + this.dy > height - radius || y + this.dy < radius) {
      this.dy = -this.dy;
    }
  }

  update() {
    let { x, y } = this.position;

    this.checkCollisionsWithEntities();
    this.checkCollisionsWithBounds();

    x += this.dx;
    y += this.dy;
    this.position = { x, y };
  }

  render() {
    const { renderingContext: context, radius } = this.options;
    const { x, y } = this.position;
    console.log(radius);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
  }
}
