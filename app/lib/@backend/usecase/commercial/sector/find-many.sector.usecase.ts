import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import type { Filter } from "mongodb";
import { ISectorRepository } from "@/app/lib/@backend/domain/commercial";
import { sectorRepository } from "@/app/lib/@backend/infra/repository";
import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import { PaginationResult } from "../../../domain/@shared/repository/pagination.interface";

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
