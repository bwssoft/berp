import { singleton } from "@/app/lib/util/singleton";
import {
  IMovement,
  IMovementRepository,
  Movement,
} from "@/app/lib/@backend/domain";
import { movementRepository } from "@/app/lib/@backend/infra";
import { consolidateStockByMovementUseCase } from "../stock";
import { findManyMovementUsecase } from "./find-many.movement.usecase";

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
