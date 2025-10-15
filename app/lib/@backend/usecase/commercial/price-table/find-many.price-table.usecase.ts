import type { Filter } from "mongodb";

import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";
import type { IPriceTableRepository } from "@/backend/domain/commercial";
import type { IPriceTable } from "@/backend/domain/commercial/entity/price-table.definition";
import { priceTableRepository } from "@/backend/infra";

namespace Dto {
    export interface Input {
        filter?: Filter<IPriceTable>;
        page?: number;
        limit?: number;
        sort?: Record<string, 1 | -1>;
    }
    export type Output = PaginationResult<IPriceTable>;
}
class FindManyPriceTableUsecase {
    repository: IPriceTableRepository;

    constructor() {
        this.repository = priceTableRepository;
    }

    @RemoveMongoId()
    async execute(arg: Dto.Input): Promise<Dto.Output> {
        return await this.repository.findMany(
            arg.filter ?? {},
            arg.limit,
            arg.page,
            arg.sort ?? { name: 1 }
        );
    }
}

export const findManyPriceTableUsecase = singleton(FindManyPriceTableUsecase);

