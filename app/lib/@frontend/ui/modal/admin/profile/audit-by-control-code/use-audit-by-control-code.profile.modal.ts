"use client";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import { AuditDomain, AuditType, IControl } from "@/app/lib/@backend/domain";
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

  const audits =
    useQuery({
      queryKey: ["findManyAudit", control],
      queryFn: async () => {
        const allow = await findManyAudit({
          domain: AuditDomain.profile,
          "metadata.field": "locked_control_code",
          type: AuditType.update,
          "metadata.before": { $in: [control?.code] },
          "metadata.after": { $nin: [control?.code] },
        });

        const block = await findManyAudit({
          domain: AuditDomain.profile,
          "metadata.field": "locked_control_code",
          type: AuditType.update,
          "metadata.before": { $nin: [control?.code] },
          "metadata.after": { $in: [control?.code] },
        });

        return [...allow, ...block].sort(
          (a, b) => b.created_at.getTime() - a.created_at.getTime()
        );
      },
    }).data ?? [];

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
