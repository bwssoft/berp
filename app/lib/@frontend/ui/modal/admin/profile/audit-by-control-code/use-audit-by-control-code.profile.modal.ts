"use client"
import { findManyAudit } from "@/app/lib/@backend/action/admin/audit.action";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export function useAuditByControlCodeProfileModal(accessCode: string, idProfile: string) {
    const [open, setOpen] = React.useState(false);

  const audits = useQuery({
    queryKey: ['findManyAudit', accessCode, idProfile],
    queryFn: () => findManyAudit({}),
  }).data;

  const openModalAuditByControlCodeProfile = () => {setOpen(true)};


  return {
    audits,
    open, 
    setOpen,
    openModalAuditByControlCodeProfile
  };
}
