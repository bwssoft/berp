import { IProfile } from "@/app/lib/@backend/domain";
import { PaginationResult } from "@/app/lib/@backend/domain/@shared/repository/pagination.interface";
import { UsersIcon } from "@heroicons/react/24/outline";

type Props = {
  profiles: PaginationResult<IProfile>;
  isLoading?: boolean;
};

export function ListProfileDescription({ profiles, isLoading }: Props) {

  return (
    <div className="bg-white w-full rounded-md shadow-md p-6">
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="bg-gray-100 rounded-full p-2" aria-label="Ícone de usuários">
          <UsersIcon className="w-5" />
        </div>
        <h2 className="text-center font-medium">Perfis</h2>
      </div>

      {isLoading ? (
        <div className="text-center py-4 text-sm text-gray-500">
          Carregando perfis... <span className="animate-pulse">⏳</span>
        </div>
      ) : profiles.docs.length === 0 ? (
        <div className="text-center py-4 text-sm text-gray-500">
          Nenhum perfil vinculado a este módulo.
        </div>
      ) : (
        <ul role="list" className="divide-y divide-gray-200 mt-4">
          {profiles.docs.map((profile) => (
            <li
              key={profile.id}
              className="flex justify-between gap-x-6 py-4 px-6"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="truncate text-sm text-gray-500">
                    {profile.name}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
