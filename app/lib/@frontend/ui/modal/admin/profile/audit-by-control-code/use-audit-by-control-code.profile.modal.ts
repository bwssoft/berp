"use client";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import { AuditDomain, IControl } from "@/app/lib/@backend/domain";
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
      queryFn: () =>
        findManyAudit({
          domain: AuditDomain.profile,
          "metadata.field": "locked_control_code",
          $or: [
            { "metadata.before": { $in: [control?.code] } },
            { "metadata.after": { $in: [control?.code] } },
          ],
        }),
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
