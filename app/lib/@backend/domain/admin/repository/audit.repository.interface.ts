import { IBaseRepository } from "@/backend/domain/@shared/repository/repository.interface";
import { IAudit } from "@/backend/domain/admin/entity/audit.definition";

export interface IAuditRepository extends IBaseRepository<IAudit> { }
