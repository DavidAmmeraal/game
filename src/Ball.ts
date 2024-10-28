import { Mixin } from "ts-mixer";
import { Collidable } from "./core/Collidable";
import { GameEntity } from "./core/GameEntity";
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
  collisionEntities?: Set<GameEntity>;
  checkOutOfBounds?: (position: Position2D) => void;
  onOutOfBounds?: () => void;
  onCollide?: () => void;
};

export class Ball extends Mixin(Collidable) implements GameEntity {
  private position;
  private _velocity: number = 0;
  private dx: number = 0;
  private dy: number = 0;

  constructor(private options: BallOptions) {
    super();
    this.position = options.position;

    this.setVelocity(this.options.velocity);
    this.collisions.events.on("collision", () => {
      this.dx = -this.dx;
      this.dy = -this.dy;
    });
  }

  public getShape() {
    return {
      type: "circle",
      radius: this.options.radius,
      position: this.position,
    } as const;
  }

  public get velocity(): number {
    return this._velocity;
  }

  public setVelocity(velocity: number) {
    this._velocity = velocity;
    this.dx = this.options.velocity;
    this.dy = -this.options.velocity;
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

  start() {}

  update() {
    console.log("update!");
    let { x, y } = this.position;
    x += this.dx;
    y += this.dy;
    this.position = { x, y };
    this.checkCollisionsWithBounds();
  }

  render() {
    const { renderingContext: context, radius } = this.options;
    const { x, y } = this.position;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
  }
}
