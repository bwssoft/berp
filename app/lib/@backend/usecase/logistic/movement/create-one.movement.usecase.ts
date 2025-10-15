import { singleton } from "@/app/lib/util/singleton";
import { consolidateStockByMovementUseCase } from "@/backend/usecase/logistic/stock/consolidate-by-movement.stock.usecasse";
import type { IMovement } from "@/backend/domain/logistic/entity/movement.entity";
import type { IMovementRepository } from "@/backend/domain/logistic/repository/movement.repository";
import { movementRepository } from "@/backend/infra";
import { randomUUID } from "crypto";

namespace Dto {
  export type Input = Omit<IMovement, "id" | "created_at">;
  export type Output = IMovement;
}

class CreateOneMovementUsecase {
  private repository: IMovementRepository;

  constructor() {
    this.repository = movementRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    const movement: IMovement = {
      ...input,
      id: randomUUID(),
      created_at: new Date(),
    };

    await this.repository.create(movement);
    await consolidateStockByMovementUseCase.execute([movement]);

    return movement;
  }
}

export const createOneMovementUsecase = singleton(CreateOneMovementUsecase);
