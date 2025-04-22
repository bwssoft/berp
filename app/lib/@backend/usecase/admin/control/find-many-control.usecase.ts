import { IControl, IControlRepository } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { controlRepository } from "@/app/lib/@backend/infra";
import { Filter } from "mongodb";

namespace Dto {
  export interface Input extends Filter<IControl> {}
  export type Output = IControl[];
}

class FindManyControlUsecase {
  repository: IControlRepository;

  constructor() {
    this.repository = controlRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input, limit?: number): Promise<Dto.Output> {
    return await this.repository.findMany(arg, limit ?? 20);
  }
}

export const findManyControlUsecase = singleton(FindManyControlUsecase);
