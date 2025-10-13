import { singleton } from "@/app/lib/util/singleton";
import type { IMovement } from "@/backend/domain/logistic/entity/movement.entity";
import type { IMovementRepository } from "@/backend/domain/logistic/repository/movement.repository";
import { movementRepository } from "@/backend/infra";

class UpdateOneMovementUsecase {
  repository: IMovementRepository;

  constructor() {
    this.repository = movementRepository;
  }

  async execute(
    query: { id: string },
    value: Omit<IMovement, "id" | "created_at">
  ) {
    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateOneMovementUsecase = singleton(UpdateOneMovementUsecase);
