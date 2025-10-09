import { singleton } from "@/app/lib/util/singleton";
import { IComponent } from "@/backend/domain/engineer/entity/component.definition";
import { IComponentRepository } from "@/backend/domain/engineer/repository/component.repository";
import { componentRepository } from "@/backend/infra";

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

