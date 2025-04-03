import {
    AuditDomain,
    AuditMetadata,
    IAudit,
    IAuditRepository,
    AuditType,
} from "@/app/lib/@backend/domain";
import { auditRepository } from "@/app/lib/@backend/infra/repository/mongodb/admin/audit.repository";
import { singleton } from "@/app/lib/util/singleton";
import isEqual from "lodash/isEqual";
import { randomUUID } from "crypto";

namespace Dto {
    export type Input<Before = object, After = object> = {
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
        const { before, after, domain, user } = input;

        const metadata: AuditMetadata[] = [];

        for (const key of Object.keys(after)) {
            const beforeValue = (before as any)[key];
            const afterValue = (after as any)[key];
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
            affected_entity_id: (after as any).id ?? "unknown",
            domain,
            type: metadata.length === 0 ? AuditType.create : AuditType.update,
            action: metadata.length === 0 ? "create" : "update",
            metadata,
            created_at: new Date(),
            user,
        };

        await this.repository.create(audit);

        return audit;
    }
}

export const createOneAuditUsecase = singleton(CreateOneAuditUsecase);
