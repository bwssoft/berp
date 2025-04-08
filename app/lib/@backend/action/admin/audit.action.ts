"use server";

import { Filter } from "mongodb";
import { IAudit } from "@/app/lib/@backend/domain";
import { findManyAuditUsecase } from "@/app/lib/@backend/usecase/admin/audit";

export async function findManyAudit(filter: Filter<IAudit> = {}) {
    return await findManyAuditUsecase.execute(filter);
}
