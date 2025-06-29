import { singleton } from "@/app/lib/util/singleton";
import {
  IMovement,
  IMovementRepository,
  Movement,
} from "@/app/lib/@backend/domain";
import { movementRepository } from "@/app/lib/@backend/infra";
import { consolidateStockByMovementUseCase } from "../stock";

class CreateManyMovementUsecase {
  repository: IMovementRepository;

  constructor() {
    this.repository = movementRepository;
  }

  async execute(input: Omit<IMovement, "created_at" | "seq">[]) {
    try {
      const last_movement = await this.repository.findOne(
        {},
        { sort: { code: -1 }, limit: 1 }
      );
      let seq = last_movement?.seq ? last_movement?.seq + 1 : 1;

      const _input: IMovement[] = [];
      for (const p in input) {
        const movement = input[p];
        seq++;
        _input.push(
          Object.assign(movement, {
            created_at: new Date(),
            seq,
            confirmed_at:
              movement.status === Movement.Status.CONFIRM
                ? new Date()
                : undefined,
          })
        );
      }

      await this.repository.createMany(_input);

      await consolidateStockByMovementUseCase.execute(_input);

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

export const createManyMovementUsecase = singleton(CreateManyMovementUsecase);
