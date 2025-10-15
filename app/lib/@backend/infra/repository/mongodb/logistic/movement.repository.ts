import type { IMovement } from "@/backend/domain/logistic/entity/movement.entity";
import type { IMovementRepository } from "@/backend/domain/logistic/repository/movement.repository.interface";
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

