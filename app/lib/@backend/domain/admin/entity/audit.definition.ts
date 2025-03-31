enum AuditType {
    create = "create",
    update = "updated"
}

type AuditMetadata = {
    field: string
    after: any
    before: any
}

enum AuditDomain {
    user = "user"
}

interface AuditUser {
    id: string
    name: string
    email: string
}

export interface IAudit {
    id: string;
    affected_entity_id: string
    domain: AuditDomain
    type: AuditType
    action: string
    metadata: AuditMetadata[]
    created_at: Date
    user: AuditUser
}
