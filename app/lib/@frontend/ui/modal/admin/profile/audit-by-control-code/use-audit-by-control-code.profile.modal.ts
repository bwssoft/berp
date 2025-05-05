"use client";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import {
  AuditDomain,
  AuditType,
  IAudit,
  IControl,
} from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useAuditByControlCodeProfileModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const [control, setControl] =
    useState<Pick<IControl, "id" | "name" | "code">>();
  const handleControlSelection = useCallback(
    (control: Pick<IControl, "id" | "name" | "code">) => {
      setControl(control);
      setOpen(true);
    },
    []
  );

  const { data: audits = [] } = useQuery({
    queryKey: ["findManyAudit", control],
    queryFn: async () => {
      const { docs: allowResponse } = await findManyAudit({
        domain: AuditDomain.profile,
        "metadata.field": "locked_control_code",
        type: AuditType.update,
        "metadata.before": { $in: [control?.code] },
        "metadata.after": { $nin: [control?.code] },
      });

      const { docs: blockResponse } = await findManyAudit({
        domain: AuditDomain.profile,
        "metadata.field": "locked_control_code",
        type: AuditType.update,
        "metadata.before": { $nin: [control?.code] },
        "metadata.after": { $in: [control?.code] },
      });

      const allow = Array.isArray(allowResponse) ? allowResponse : [];
      const block = Array.isArray(blockResponse) ? blockResponse : [];

      return [...allow, ...block].sort(
        (a, b) => b.created_at.getTime() - a.created_at.getTime()
      );
    },
  });

  return {
    audits,
    open,
    setOpen,
    openModal,
    closeModal,
    handleControlSelection,
    control,
  };
}
