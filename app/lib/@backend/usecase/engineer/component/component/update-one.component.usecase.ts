import { singleton } from "@/app/lib/util/singleton";
import { IComponent, IComponentRepository } from "@/app/lib/@backend/domain";
import { componentRepository } from "@/app/lib/@backend/infra";

class UpdateOneComponentUsecase {
  repository: IComponentRepository;

  constructor() {
    this.repository = componentRepository;
  }

  async execute(
    query: { id: string },
    value: Omit<IComponent, "id" | "created_at" | "seq">
  ) {
    return await this.repository.updateOne(query, { $set: value });
  }
}

export const updateOneComponentUsecase = singleton(UpdateOneComponentUsecase);
