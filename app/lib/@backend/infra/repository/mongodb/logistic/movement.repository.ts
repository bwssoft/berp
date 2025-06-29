import { IMovement, IMovementRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";

class MovementRepository
  extends BaseRepository<IMovement>
  implements IMovementRepository
{
  constructor() {
    super({
      collection: "logistic.movement",
      db: "berp",
    });
  }
}

export const movementRepository = singleton(MovementRepository);
