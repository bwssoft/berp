
import type { Filter } from "mongodb";

import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IContactRepository } from "@/backend/domain/commercial";
import type { IContact } from "@/backend/domain/commercial/entity/contact.definition";
import { contactRepository } from "@/backend/infra";

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

