"use client"
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import { useQuery } from "@tanstack/react-query";

export function useAuditByControlCodeProfileModal(accessCode: string, idProfile: string) {

  const audits = useQuery({
    queryKey: ['findManyAudit', accessCode, idProfile],
    queryFn: () => findManyAudit({}),
  }).data;

  return {
    audits,
  };
}
