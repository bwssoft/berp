"use client";
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import { AuditDomain, AuditType, IControl } from "@/app/lib/@backend/domain";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useAuditByControlCodeProfileModal() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);
  const handleChangePage = useCallback((page: number) => setPage(page), []);

  const [control, setControl] =
    useState<Pick<IControl, "id" | "name" | "code">>();
  const handleControlSelection = useCallback(
    (control: Pick<IControl, "id" | "name" | "code">) => {
      setControl(control);
      setOpen(true);
    },
    []
  );

  const { data: audits } = useQuery({
    queryKey: ["findManyAudit", control, page],
    queryFn: async () => {
      const { docs, pages, total } = await findManyAudit(
        {
          domain: AuditDomain.profile,
          "metadata.field": "locked_control_code",
          type: AuditType.update,
          $or: [
            {
              "metadata.before": { $in: [control?.code] },
              "metadata.after": { $nin: [control?.code] },
            },
            {
              "metadata.before": { $nin: [control?.code] },
              "metadata.after": { $in: [control?.code] },
            },
          ],
        },
        page
      );

      return {
        docs,
        pages,
        total,
      };
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
    handleChangePage,
    page,
  };
}
