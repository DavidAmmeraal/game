import { GameEntity } from "./GameEntity";
import { EventEmitter } from "./EventEmitter";
import { collide } from "./collide";
import { Shape } from "./Shape";
import { hasMixin } from "ts-mixer";

export interface CollidableEntity extends GameEntity {
  collisions: {
    events: EventEmitter<CollidableEvents>;
    collides: (entity: CollidableEntity) => boolean;
  };
}
type CollidableEvents = {
  collision: [GameEntity];
};

export abstract class Collidable {
  collisions = {
    events: new EventEmitter<CollidableEvents>(),
    collides: (entity: CollidableEntity) => {
      const shapeA = entity.getShape?.();
      const shapeB = this?.getShape();
      if (shapeA && shapeB) {
        return collide(shapeA, shapeB);
      }
      return false;
    },
  };

  abstract getShape(): Shape | undefined;
}

export function isCollidableEntity(
  entity: unknown,
): entity is CollidableEntity {
  return hasMixin(entity, Collidable);
}
