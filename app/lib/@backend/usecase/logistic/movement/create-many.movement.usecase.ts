import { singleton } from "@/app/lib/util/singleton";
import { IMovement, IMovementRepository } from "@/app/lib/@backend/domain";
import { movementRepository } from "@/app/lib/@backend/infra";

class CreateManyMovementUsecase {
  repository: IMovementRepository;

  constructor() {
    this.repository = movementRepository;
  }

  async execute(input: Omit<IMovement, "id" | "created_at" | "seq">[]) {
    try {
      const last_movement = await this.repository.findOne(
        {},
        { sort: { code: -1 }, limit: 1 }
      );
      const last_seq = last_movement?.seq ?? 0;

      const _input: IMovement[] = [];
      for (const p in input) {
        const movement = input[p];
        const seq = Number(p) + 1 + last_seq;
        _input.push(
          Object.assign(movement, {
            created_at: new Date(),
            id: crypto.randomUUID(),
            seq,
          })
        );
      }

      await this.repository.createMany(_input);
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
