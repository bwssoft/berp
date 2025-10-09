import { singleton } from "@/app/lib/util/singleton";
import { IComponent } from "@/app/lib/@backend/domain/engineer/entity/component.definition";
import { IComponentRepository } from "@/app/lib/@backend/domain/engineer/repository/component.repository.interface";
import { componentRepository } from "@/app/lib/@backend/infra";

class DeleteOneComponentUsecase {
  repository: IComponentRepository;

  constructor() {
    this.repository = componentRepository;
  }

  async execute(component: Partial<IComponent>) {
    return await this.repository.deleteOne(component);
  }
}

export const deleteOneComponentUsecase = singleton(DeleteOneComponentUsecase);
