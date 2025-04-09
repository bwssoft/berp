"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";

export function useAuditModal() {
    const [open, setOpen] = useState(false);

    const openModal = useCallback(() => setOpen(true), []);
    const closeModal = useCallback(() => setOpen(false), []);

    const {
        data: auditData = [],
        error,
        refetch,
    } = useQuery({
        queryKey: ["audit"],
        queryFn: () => findManyAudit({}),
    });

    return {
        open,
        auditData,
        openModal,
        closeModal,
        error,
        refetch,
    };
}
