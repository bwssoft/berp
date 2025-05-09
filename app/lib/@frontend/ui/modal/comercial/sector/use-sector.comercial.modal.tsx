"use client";

import { ISector } from "@/app/lib/@backend/domain/commercial/entity/sector.definition";
import { useCallback, useState } from "react";

export function useSectorModal(initial: ISector[] = []) {
    const [open, setOpen] = useState(false);
    const openModal = useCallback(() => setOpen(true), []);
    const closeModal = useCallback(() => setOpen(false), []);

    const [sectors, setSectors] = useState<ISector[]>(initial);

    const addSector = (name: string) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        setSectors((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: trimmed,
                active: true,
                created_at: new Date(),
            },
        ]);
    };

    const toggleSector = (id: string) =>
        setSectors((prev) =>
            prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
        );

    const deleteSector = (id: string) =>
        setSectors((prev) => prev.filter((s) => s.id !== id));

    return {
        open,
        openModal,
        closeModal,
        sectors,
        addSector,
        toggleSector,
        deleteSector,
    };
}
