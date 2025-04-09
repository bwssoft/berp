"use client"
import { findManyProfile } from "@/app/lib/@backend/action";
import { useQuery } from "@tanstack/react-query";

export function useProfileLinkedControlModal(nameProfile: string) {

  const profiles = useQuery({
    queryKey: ['findManyProfiles', nameProfile],
    queryFn: () => findManyProfile({"locked_control_code": nameProfile}),
  }).data;

  return {
    profiles,
  };
}
