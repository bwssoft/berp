import { singleton } from "@/app/lib/util/singleton";
import { IComponent, IComponentRepository } from "@/app/lib/@backend/domain";
import { componentRepository } from "@/app/lib/@backend/infra";

class FindOneComponentUsecase {
  repository: IComponentRepository;

  constructor() {
    this.repository = componentRepository;
  }

  async execute(component: Partial<IComponent>) {
    return await this.repository.findOne(component);
  }
}

export const findOneComponentUsecase = singleton(FindOneComponentUsecase);
