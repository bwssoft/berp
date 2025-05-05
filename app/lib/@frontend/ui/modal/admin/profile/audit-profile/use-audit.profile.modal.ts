"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import { AuditDomain } from "@/app/lib/@backend/domain";
import { IProfile } from "@/app/lib/@backend/domain";

export function useAuditProfileModal() {
    const [open, setOpen] = useState(false);
    const openModal = useCallback(() => setOpen(true), []);
    const closeModal = useCallback(() => setOpen(false), []);

    const [profile, setProfile] = useState<Pick<IProfile, "id" | "name">>();

    const handleProfileSelection = useCallback(
        (profile: Pick<IProfile, "id" | "name">) => {
            setProfile(profile);
            setOpen(true);
        },
        []
    );

    const {
        data: auditData = [],
        error,
        refetch,
    } = useQuery({
        queryKey: ["findManyProfileAudit", profile],
        queryFn: async () => {
            const { docs } = await findManyAudit({
                domain: AuditDomain.profile,
                affected_entity_id: profile?.id,
            })
            return docs
        }
    });

    return {
        open,
        auditData,
        openModal,
        closeModal,
        error,
        refetch,
        handleProfileSelection,
        profile,
    };
}
