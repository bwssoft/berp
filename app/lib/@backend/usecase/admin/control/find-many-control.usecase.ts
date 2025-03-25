import { IControl, IControlRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { controlRepository } from "@/app/lib/@backend/infra";

namespace Dto {
  export interface Input extends Partial<IControl> {}
  export type Output = IControl[];
}

class FindManyControlUsecase {
  repository: IControlRepository;

  constructor() {
    this.repository = controlRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findAll(arg);
  }
}

export const findManyControlUsecase = singleton(FindManyControlUsecase);
