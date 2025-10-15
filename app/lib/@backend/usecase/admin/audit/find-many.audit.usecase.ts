import type { Filter } from "mongodb";

import type { IAudit } from "@/backend/domain/admin/entity/audit.definition";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { auditRepository } from "@/backend/infra";
import { PaginationResult } from "@/backend/domain/@shared/repository/pagination.interface";

namespace Dto {
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

