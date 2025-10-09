import type { IControl } from "@/backend/domain/admin/entity/control.definition";
import type { IControlRepository } from "@/backend/domain/admin/repository/control.repository.interface";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { controlRepository } from "@/backend/infra";

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
    return this.repository.findOne(arg);
  }
}

export const findOneControlUsecase = singleton(FindOneControlUsecase);

