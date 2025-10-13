
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { IItem } from "@/backend/domain/logistic/entity/item.entity";
import type { IItemRepository } from "@/backend/domain/logistic/repository/item.repository";
import { itemRepository } from "@/backend/infra";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input {
    filter?: Filter<IItem>;
  }
  export type Output = IItem | null;
}

class FindOneItemUsecase {
  repository: IItemRepository = itemRepository;

  @RemoveMongoId()
  async execute(arg: Dto.Input): Promise<Dto.Output> {
    return await this.repository.findOne(arg.filter ?? {});
  }
}

export const findOneItemUsecase = singleton(FindOneItemUsecase);
