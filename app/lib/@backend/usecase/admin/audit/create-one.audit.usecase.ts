import {
  AuditDomain,
  AuditMetadata,
  AuditType,
  type IAudit,
} from "@/backend/domain/admin/entity/audit.definition";
import type { IAuditRepository } from "@/backend/domain/admin/repository/audit.repository.interface";
import { auditRepository } from "@/backend/infra/mongodb/admin/audit.repository";
import { singleton } from "@/app/lib/util/singleton";
import isEqual from "lodash/isEqual";
import { randomUUID } from "crypto";

namespace Dto {
    export type Input<Before = object, After = object> = {
        action: string;
        before: Before;
        after: After;
        domain: AuditDomain;
        user: {
            id: string;
            name: string;
            email: string;
        };
    };

    export type Output = IAudit;
}

class CreateOneAuditUsecase {
    private repository: IAuditRepository;

    constructor() {
        this.repository = auditRepository;
    }

    async execute<Before extends object, After extends object>(
        input: Dto.Input<Before, After>
    ): Promise<Dto.Output> {
        const { before, after, domain, user, action } = input;
        const metadata: AuditMetadata[] = [];

        const allKeys = new Set([
            ...Object.keys(before || {}),
            ...Object.keys(after || {}),
        ]);

        for (const key of Array.from(allKeys)) {
            const beforeValue = (before as any)?.[key];
            const afterValue = (after as any)?.[key];

            if (!isEqual(beforeValue, afterValue)) {
                metadata.push({
                    field: key,
                    before: beforeValue,
                    after: afterValue,
                });
            }
        }
        const audit: IAudit = {
            id: randomUUID(),
            affected_entity_id: (after as any).id,
            domain,
            type:
                Object.keys(before).length === 0
                    ? AuditType.create
                    : AuditType.update,
            action: action,
            metadata,
            created_at: new Date(),
            user,
        };

        await this.repository.create(audit);

        return audit;
    }
}

export const createOneAuditUsecase = singleton(CreateOneAuditUsecase);


