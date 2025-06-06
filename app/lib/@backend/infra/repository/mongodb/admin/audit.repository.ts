import { IAudit } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";
import { singleton } from "@/app/lib/util/singleton";

class AuditRepository extends BaseRepository<IAudit> {
  constructor() {
    super({
      collection: "admin.audit",
      db: "berp",
    });
  }
}

export const auditRepository = singleton(AuditRepository);
