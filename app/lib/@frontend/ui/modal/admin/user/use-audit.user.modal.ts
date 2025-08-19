"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import { AuditDomain, IUser } from "@/app/lib/@backend/domain";

export function useAuditUserModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const [page, setPage] = useState<number>(1);
  const [user, setUser] = useState<Pick<IUser, "id" | "name">>();
  const handleUserSelection = useCallback(
    (user: Pick<IUser, "id" | "name">) => {
      setUser(user);
      setOpen(true);
    },
    []
  );

  const handlePageChange = (page: number) => setPage(page);

  const {
    data: auditData,
    error,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["findManyUserAudit", user, page],
    queryFn: async () => {
      return await findManyAudit(
        {
          domain: AuditDomain.user,
          affected_entity_id: user?.id,
        },
        page
      );
    },
  });

  return {
    open,
    auditData,
    isLoading,
    openModal,
    closeModal,
    error,
    refetch,
    handleUserSelection,
    handlePageChange,
    user,
    page,
  };
}
