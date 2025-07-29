import {
  IAddress,
  IContact,
  IContactRepository,
} from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { contactRepository } from "@/app/lib/@backend/infra";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
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
