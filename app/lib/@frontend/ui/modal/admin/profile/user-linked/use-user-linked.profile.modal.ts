"use client"
import { findManyUser } from "@/app/lib/@backend/action";
import { IProfile } from "@/app/lib/@backend/domain";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useUserLinkedProfileModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const [profile, setProfile] = useState<Pick<IProfile, "id" | "name">>()
  const handleProfileSelection = useCallback((profile: Pick<IProfile, "id" | "name">) => {
    setProfile(profile)
    setOpen(true)
  },[])
  
  const users = useQuery({
    queryKey: ['findManyUsers', profile],
    queryFn: () => findManyUser({"profile.name": profile?.name}),
  }).data ?? [];

  return {
    users,
    handleProfileSelection,
    openModal,
    closeModal,
    open,
    profile
  };
}
