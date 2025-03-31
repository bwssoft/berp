import { findManyControl, findOneProfile } from "@/app/lib/@backend/action";
import { Button } from "@/app/lib/@frontend/ui/component";
import { ChooseProfileForm } from "@/app/lib/@frontend/ui/form";
import { cn } from "@/app/lib/util";
import { Badge } from "@bwsoft/badge";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  IdentificationIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  searchParams: {
    profile_id?: string[];
  };
}
export default async function Example(props: Props) {
  const { searchParams } = props;
  const [profile, controls] = await Promise.all([
    findOneProfile({ id: searchParams.profile_id }),
    findManyControl({ parent_code: undefined }),
  ]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Controle de Acesso
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Tela para o gerenciamento de acessos que cada perfil pode fazer.
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ChooseProfileForm profile={profile} />
      </div>
      <div className="mt-10 px-4 sm:px-6 lg:px-8">
        <div className="p-4 sm:p-6 lg:p-8 ring-1 ring-inset ring-gray-900/10 rounded-md shadow-sm bg-white">
          {profile?.name ? (
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Perfil: {profile?.name}
            </h1>
          ) : (
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Listagem dos módulos
            </h1>
          )}
          <div className="mt-4 border-b border-gray-900/10" />
          <ul
            role="list"
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {controls.map((control) => (
              <li
                key={control.id}
                className={cn(
                  "group relative p-6 bg-white col-span-1 rounded-lg shadow ring-1 ring-inset ring-gray-900/10"
                )}
              >
                <div>
                  <h3 className="text-base font-semibold text-gray-900">
                    {control.name}
                  </h3>
                  <div className="w-fit mt-2 flex divide-x-2 divide-gray-300 text-sm text-gray-400 hover:cursor-pointer">
                    <Link
                      href={`/admin/control/${control.id}/${profile?.id ?? ""}`}
                      key={control.id}
                      className="hover:text-gray-500 pr-2"
                    >
                      Detalhes
                    </Link>
                    <p className="hover:text-gray-500 px-2">Ver Perfis</p>
                  </div>
                </div>
                {profile &&
                  !profile?.locked_control_code.includes(control.code) && (
                    <span
                      aria-hidden="true"
                      className="absolute right-6 top-6 flex gap-2"
                    >
                      <div className="mt-1 flex items-center text-xs text-green-600">
                        <CheckCircleIcon className="w-4 h-4 mr-1" />
                        Presente no perfil
                      </div>
                    </span>
                  )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
