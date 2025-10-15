import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import type { Filter } from "mongodb";
import { ISectorRepository } from "@/backend/domain/commercial";
import { sectorRepository } from "@/backend/infra";
import { ISector } from "@/backend/domain/commercial/entity/sector.definition";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

namespace Dto {
    export interface Input {
        filter?: Filter<ISector>;
        page?: number;
        limit?: number;
        sort?: Record<string, 1 | -1>;
    }
    export type Output = PaginationResult<ISector>;
}
class FindManySectorUsecase {
    repository: ISectorRepository;

    constructor() {
        this.repository = sectorRepository;
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

export const findManySectorUsecase = singleton(FindManySectorUsecase);

