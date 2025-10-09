"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import {AuditDomain} from "@/app/lib/@backend/domain/admin/entity/audit.definition";
import {IProfile} from "@/app/lib/@backend/domain/admin/entity/profile.definition";

const PAGE_SIZE = 10;

export function useAuditProfileModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const [currentPage, setCurrentPage] = useState(1);

  const [profile, setProfile] = useState<Pick<IProfile, "id" | "name">>();

  const handleProfileSelection = useCallback(
    (profile: Pick<IProfile, "id" | "name">) => {
      setProfile(profile);
      setOpen(true);
      setCurrentPage(1);
    },
    []
  );

  const {
    data: audits = { docs: [], total: 0, pages: 1 },
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["findManyProfileAudit", profile, currentPage],
    queryFn: async () => {
      if (!profile) return { docs: [], total: 0, pages: 1 };
      
      const filter = {
        domain: AuditDomain.profile,
        affected_entity_id: profile.id,
      }
      
      return await findManyAudit(filter,
        currentPage, PAGE_SIZE);
    },
  });

  // Função para alterar a páginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    open,
    audits,
    openModal,
    closeModal,
    error,
    isLoading,
    handleProfileSelection,
    profile,
    currentPage,
    handlePageChange,
  };
}
