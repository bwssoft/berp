"use client";

import { IUser } from "@/app/lib/@backend/domain";
import { UsersIcon } from "@heroicons/react/24/outline";
import { Pagination } from "../../../component/pagination";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { useUserLinkedProfileModal } from "../../../modal";

type Props = {
  users: PaginationResult<IUser>;
  isLoading?: boolean;
  handlePageChange: (page: number) => void
  currentPage: number
};

export function ListUserDescription({
  users,
  isLoading,
  handlePageChange,
  currentPage
}: Props) {

  return (
    <div className="bg-white w-full rounded-md shadow-md">
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="bg-gray-100 rounded-full p-2" aria-label="Ícone de usuários">
          <UsersIcon className="w-5" />
        </div>
        <h2 className="text-center font-medium">Usuários</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-sm text-gray-500">
          Carregando usuários... <span className="animate-pulse">⏳</span>
        </div>
      ) : users?.docs?.length === 0 ? (
        <div className="text-center py-4 text-sm text-gray-500">
          Nenhum usuário vinculado a este perfil.
        </div>
      ) : (
        <>
          <ul role="list" className="divide-y divide-gray-200">
            {users.docs?.map((person) => (
              <li key={person.email} className="flex justify-between gap-x-6 py-4 px-6">
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto">
                    <p className="truncate text-sm text-gray-500">{person.name}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={users.pages!}
              totalItems={users.total!}
              limit={users.limit!}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
