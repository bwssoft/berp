import { IControl } from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { IControlRepository } from "@/app/lib/@backend/domain/admin/repository/control.repository.interface";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { controlRepository } from "@/app/lib/@backend/infra";

namespace Dto {
  export interface Input extends Partial<IControl> {}
  export type Output = IControl | null;
}

class FindOneControlUsecase {
  repository: IControlRepository;

  constructor() {
    this.repository = controlRepository;
  }

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findOne(arg);
  }
}

export const findOneControlUsecase = singleton(FindOneControlUsecase);
