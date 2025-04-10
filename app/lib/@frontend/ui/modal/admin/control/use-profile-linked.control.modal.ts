"use client"
import { findManyProfile } from "@/app/lib/@backend/action";
import { IControl } from "@/app/lib/@backend/domain";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useProfileLinkedControlModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const [control, setControl] = useState<Pick<IControl, "id" | "name" | "code">>()
  const handleControlSelection = useCallback((control: Pick<IControl, "id" | "name" | "code">) => {
    setControl(control)
    setOpen(true)
  },[])

  const profiles = useQuery({
    queryKey: ['findManyProfiles', control],
    queryFn: () => findManyProfile({"locked_control_code": {$nin: [control?.code!]}}),
  }).data ?? [];

  return {
    profiles,
    handleControlSelection,
    open,
    openModal,
    closeModal,
    control
  };
}
