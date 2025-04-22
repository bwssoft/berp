import { Filter } from "mongodb";

import { IAudit } from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { auditRepository } from "../../../infra/repository/mongodb/admin/audit.repository";

export namespace Dto {
    export type Input = Filter<IAudit>;
    export type Output = IAudit[];
}

class FindManyAuditUsecase {
    repository = auditRepository;

    @RemoveMongoId()
    async execute(input: Dto.Input): Promise<Dto.Output> {
        return await this.repository.findMany(input);
    }
}

export const findManyAuditUsecase = singleton(FindManyAuditUsecase);
