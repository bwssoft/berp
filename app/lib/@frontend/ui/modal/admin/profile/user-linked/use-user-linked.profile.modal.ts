"use client"
import { findManyUser } from "@/app/lib/@backend/action";
import { useQuery } from "@tanstack/react-query";

export function useUserLinkedProfileModal(nameProfile: string) {

  const users = useQuery({
    queryKey: ['findManyUsers', nameProfile],
    queryFn: () => findManyUser({"profile.name": nameProfile}),
  }).data;

  return {
    users,
  };
}
