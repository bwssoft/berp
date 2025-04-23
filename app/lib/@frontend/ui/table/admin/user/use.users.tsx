
import { useQuery } from "@tanstack/react-query";
import { findManyUserPagination } from "@/app/lib/@backend/action/admin/user.action";

export function useUsers(page: number, limit: number) {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => findManyUserPagination({}, page, limit),
    keepPreviousData: true,
  });
}
