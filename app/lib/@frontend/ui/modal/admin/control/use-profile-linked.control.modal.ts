"use client"
import { findManyProfile } from "@/app/lib/@backend/action/admin/profile.action";
import {IControl} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import {IProfile} from "@/app/lib/@backend/domain/admin/entity/profile.definition";
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
    queryFn: async () => {
      const filter: Record<string, any> = {};

      if (control?.code.trim() !== "") {
        filter["locked_control_code"] = { $regex: control?.code, $options: "i" };
      }
      const result = await findManyProfile(filter)
      return result
    },
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
