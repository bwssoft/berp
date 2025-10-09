import { singleton } from "@/app/lib/util/singleton";
import { IComponent } from "@/app/lib/@backend/domain/engineer/entity/component.definition";
import { IComponentRepository } from "@/app/lib/@backend/domain/engineer/repository/component.repository.interface";
import { componentRepository } from "@/app/lib/@backend/infra";

class UpdateOneComponentUsecase {
  repository: IComponentRepository;

  constructor() {
    this.repository = componentRepository;
  }

  async execute(
    query: { id: string },
    value: Omit<IComponent, "id" | "created_at" | "seq" | "sku">
  ) {
    try {
      await this.repository.updateOne(query, { $set: value });
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

export const updateOneComponentUsecase = singleton(UpdateOneComponentUsecase);
