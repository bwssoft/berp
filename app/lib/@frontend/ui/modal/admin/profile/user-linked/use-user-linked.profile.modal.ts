"use client"
import { findManyUser } from "@/app/lib/@backend/action";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export function useUserLinkedProfileModal(nameProfile?: string) {
  const [open, setOpen] = React.useState(false);
  
  const users = useQuery({
    queryKey: ['findManyUsers', nameProfile],
    queryFn: () => findManyUser({"profile.name": nameProfile}),
  }).data;

  const openModalUserLinkedProfile = () => {setOpen(true)};

  return {
    users,
    openModalUserLinkedProfile,
    setOpen,
    open
  };
}
