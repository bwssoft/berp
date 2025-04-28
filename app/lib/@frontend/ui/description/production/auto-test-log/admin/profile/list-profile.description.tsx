import { IProfile } from "@/app/lib/@backend/domain";
import { UsersIcon } from "@heroicons/react/24/outline";

type Props = {
  profiles: IProfile[];
};

export function ListProfileDescription({ profiles }: Props) {
  return (
    <div className="bg-white w-full rounded-md shadow-md">
      <div className="flex flex-col justify-center items-center gap-1">
        <div className="bg-gray-100 rounded-full p-2" aria-label="Ícone de usuários">
          <UsersIcon className="w-5" />
        </div>
        <h2 className="text-center font-medium">Perfis</h2>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {profiles.map((profile) => (
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
    </div>
  );
}