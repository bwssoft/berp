"use server";

import { Filter } from "mongodb";
import { IAudit } from "@/app/lib/@backend/domain/admin/entity/audit.definition";
import { findManyAuditUsecase } from "@/app/lib/@backend/usecase/admin/audit/find-many.audit.usecase";

export async function findManyAudit(
    filter: Filter<IAudit> = {},
    page?: number,
    limit?: number,
    sort?: Record<string, 1 | -1>
) {
    return await findManyAuditUsecase.execute({ filter, page, limit, sort });
}
