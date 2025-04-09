"use client"
import { findManyProfile } from "@/app/lib/@backend/action";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export function useProfileLinkedControlModal(nameProfile?: string) {
    const [open, setOpen] = React.useState(false);

  const profiles = useQuery({
    queryKey: ['findManyProfiles', nameProfile],
    queryFn: () => findManyProfile({"locked_control_code": nameProfile}),
  }).data;

  const openModalProfileLinkedControl = () => {setOpen(true)};

  return {
    profiles,
    openModalProfileLinkedControl,
    open,
    setOpen
  };
}
