"use client";
import { findManyUser } from "@/app/lib/@backend/action";
import { IProfile, IUser } from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

const PAGE_SIZE = 10;

export function useUserLinkedProfileModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const [profile, setProfile] = useState<Pick<IProfile, "id" | "name">>();

  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const handleProfileSelection = useCallback((profile: Pick<IProfile, "id" | "name">) => {
    setProfile(profile);
    setOpen(true);
    setCurrentPage(1);
  }, []);

  const { data: users = { docs: [], total: 0, pages: 1 }, isLoading } = useQuery({
    queryKey: ["findManyUsers", profile, currentPage], 
    queryFn: async () => {
      if (!profile?.name) return { docs: [], total: 0, pages: 1 };

      const filter = {
        "profile.name": profile.name,
      };

      const { docs, total, pages, limit } = await findManyUser(filter, currentPage, PAGE_SIZE);

      return { docs, total, pages, limit }; 
    },
    enabled: !!profile,
    initialData: { docs: [], total: 0, pages: 1 }
  });

  // Função para alterar a páginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    queryClient.invalidateQueries({ queryKey: ["findManyUsers", profile, page] });
  };

  return {
    users: users as PaginationResult<IUser>,
    handleProfileSelection,
    openModal,
    closeModal,
    open,
    profile,
    isLoading,
    currentPage,
    handlePageChange
  };
}
