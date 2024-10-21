import { GameEntity } from "./GameEntity";
import { EventEmitter } from "./EventEmitter";
import { GenericConstructor } from "./GenericConstructor";
import { collide } from "./collide";

export interface CollidableEntity extends GameEntity {
  collisions: {
    events: EventEmitter<CollidableEvents>;
    collides: (entity: CollidableEntity) => boolean;
  };
}
type CollidableEvents = {
  collision: [GameEntity];
};

export function Collidable<TBase extends GenericConstructor<GameEntity>>(
  Base: TBase,
) {
  return class extends Base implements CollidableEntity {
    collisions = {
      events: new EventEmitter<CollidableEvents>(),
      collides: (entity: CollidableEntity) => {
        return collide(this.shape, entity);
      },
    };
  };
}
