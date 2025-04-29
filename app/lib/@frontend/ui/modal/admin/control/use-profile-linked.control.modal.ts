"use client"
import { findManyProfile } from "@/app/lib/@backend/action";
import { IControl, IProfile } from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
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

  const {data: profiles, isLoading} = useQuery({
    queryKey: ['findManyProfiles', control],
    queryFn: () => findManyProfile({"locked_control_code": {$nin: [control?.code!]}}),
  })

  return {
    profiles: profiles as PaginationResult<IProfile>,
    isLoading,
    handleControlSelection,
    open,
    openModal,
    closeModal,
    control
  };
}
