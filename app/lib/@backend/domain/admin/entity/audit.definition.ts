export enum AuditType {
    create = "create",
    update = "updated",
}

export type AuditMetadata = {
    field: string;
    after: any;
    before: any;
};

export enum AuditDomain {
    user = "user",
    profile = "profile",
}

export interface AuditUser {
    id: string;
    name: string;
    email: string;
}

export interface IAudit {
    id: string;
    affected_entity_id: string;
    domain: AuditDomain;
    type: AuditType;
    action: string;
    metadata: AuditMetadata[];
    created_at: Date;
    user: AuditUser;
}
