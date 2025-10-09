"use client";
import { findManyUser } from "@/app/lib/@backend/action/admin/user.action";
import {IProfile} from "@/app/lib/@backend/domain/admin/entity/profile.definition";
import {IUser} from "@/app/lib/@backend/domain/admin/entity/user.definition";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

const PAGE_SIZE = 10;

export function useUserLinkedProfileModal() {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const [profile, setProfile] = useState<Pick<IProfile, "id" | "name">>();

  const [currentPage, setCurrentPage] = useState(1);

  const handleProfileSelection = useCallback((profile: Pick<IProfile, "id" | "name">) => {
    setProfile(profile);
    setOpen(true);
    setCurrentPage(1);
  }, []);

  const { data: users = { docs: [], total: 0, pages: 1 }, isLoading } = useQuery({
    queryKey: ["findManyUsers", profile, currentPage], 
    queryFn: async () => {
      if (!profile) return { docs: [], total: 0, pages: 1 };

      const filter = {
        "profile.name": profile.name,
      };

      return await findManyUser(filter, currentPage, PAGE_SIZE);
    }
  });

  // Função para alterar a páginação
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
