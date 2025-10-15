import { singleton } from "@/app/lib/util/singleton";
import { consolidateStockByMovementUseCase } from "@/backend/usecase/logistic/stock/consolidate-by-movement.stock.usecasse";
import { Movement } from "@/backend/domain/logistic/entity/movement.entity";
import type { IMovementRepository } from "@/backend/domain/logistic/repository/movement.repository";
import { movementRepository } from "@/backend/infra";
import { findManyMovementUsecase } from "@/backend/usecase/logistic/movement/find-many.movement.usecase";

class ConfirmManyMovementUsecase {
  repository: IMovementRepository;

  constructor() {
    this.repository = movementRepository;
  }

  async execute(input: string[]) {
    try {
      const movement = await findManyMovementUsecase.execute({
        filter: { id: { $in: input } },
      });

      await this.repository.updateMany(
        { id: { $in: movement.docs.map(({ id }) => id) } },
        { $set: { confirmed_at: new Date(), status: Movement.Status.CONFIRM } }
      );

      await consolidateStockByMovementUseCase.execute(
        movement.docs.map((m) => ({ ...m, status: Movement.Status.CONFIRM }))
      );

      return {
        success: true,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          usecase: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const confirmManyMovementUsecase = singleton(ConfirmManyMovementUsecase);

