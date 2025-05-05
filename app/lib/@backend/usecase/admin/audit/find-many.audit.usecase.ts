import { Filter } from "mongodb";

import { IAudit } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { auditRepository } from "../../../infra/repository/mongodb/admin/audit.repository";
import { PaginationResult } from "../../../domain/@shared/repository/pagination.interface";

export namespace Dto {
        export interface Input {
            filter?: Filter<IAudit>;
            page?: number;
            limit?: number;
            sort?: Record<string, 1 | -1>;
        }
    export type Output = PaginationResult<IAudit>;
}

class FindManyAuditUsecase {
    repository = auditRepository;

    @RemoveMongoId()
    async execute(arg: Dto.Input): Promise<Dto.Output> {
        return await this.repository.findMany(
            arg.filter ?? {},
            arg.limit,
            arg.page,
            arg.sort
        );
    }
}

export const findManyAuditUsecase = singleton(FindManyAuditUsecase);
