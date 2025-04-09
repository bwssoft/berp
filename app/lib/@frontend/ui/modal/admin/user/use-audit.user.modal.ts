"use client";
import { useState, useEffect, useCallback } from "react";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";

export function useAuditModal() {
    const [open, setOpen] = useState(false);

    const [auditData, setAuditData] = useState([]);

    const openModal = useCallback(() => setOpen(true), []);
    const closeModal = useCallback(() => setOpen(false), []);

    useEffect(() => {
        async function fetchAudit() {
            try {
                const data = await findManyAudit({});
                setAuditData(data);
            } catch (error) {
                console.error("Erro ao buscar auditorias:", error);
            }
        }
        fetchAudit();
    }, []);

    return { open, auditData, openModal, closeModal };
}
