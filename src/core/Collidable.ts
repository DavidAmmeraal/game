import { GameEntity } from "./GameEntity";
import { EventEmitter } from "./EventEmitter";
import { collide } from "./collide";
import { Shape } from "./Shape";

export function Collidable<
  T extends abstract new (...args: any[]) => GameEntity,
>(Base: T) {
  abstract class Collidable extends Base implements CollidableEntity {
    collisions = {
      events: new EventEmitter<CollidableEvents>(),
      collides: (entity: CollidableEntity) => {
        const shapeA = entity.getCollisionShape();
        const shapeB = this.getCollisionShape();
        if (shapeA && shapeB) {
          return collide(shapeA, shapeB);
        }
        return false;
      },
    };

    abstract getCollisionShape(): Shape | undefined;
  }
  return Collidable;
}

export interface CollidableEntity extends GameEntity {
  collisions: {
    events: EventEmitter<CollidableEvents>;
    collides: (entity: CollidableEntity) => boolean;
  };
  getCollisionShape(): Shape | undefined;
}
type CollidableEvents = {
  collision: [CollidableEntity];
};

export function isCollidableEntity(
  entity: GameEntity,
): entity is CollidableEntity {
  return "collisions" in entity;
}
