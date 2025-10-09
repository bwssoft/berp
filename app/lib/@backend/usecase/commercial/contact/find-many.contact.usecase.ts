
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { contactRepository } from "@/backend/infra";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { Filter } from "mongodb";

namespace Dto {
  export interface Input {
    filter?: Filter<IContact>;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }
  export type Output = PaginationResult<IContact>;
}

class FindManyContactUsecase {
  repository: IContactRepository;

  constructor() {
    this.repository = contactRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IContact>) {
    const { docs } = await this.repository.findMany(input);
    return docs;
  }
}

export const findManyContactUsecase = singleton(FindManyContactUsecase);

