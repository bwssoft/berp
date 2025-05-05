"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import { AuditDomain, IUser } from "@/app/lib/@backend/domain";

export function useAuditUserModal() {
    const [open, setOpen] = useState(false);
    const openModal = useCallback(() => setOpen(true), []);
    const closeModal = useCallback(() => setOpen(false), []);

    const [user, setUser] = useState<Pick<IUser, "id" | "name">>()
    const handleUserSelection = useCallback((user: Pick<IUser, "id" | "name">) => {
        setUser(user)
        setOpen(true)
    },[])

    const {
        data: auditData = [],
        error,
        refetch,
    } = useQuery({
        queryKey: ["findManyUserAudit", user],
        queryFn: async () => {
            const { docs } = await findManyAudit({
                domain: AuditDomain.user, 
                affected_entity_id: user?.id
            })

            return docs
        },
    });

    return {
        open,
        auditData,
        openModal,
        closeModal,
        error,
        refetch,
        handleUserSelection,
        user
    };
}
