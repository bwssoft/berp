import { findManyControl, findOneProfile } from "@/app/lib/@backend/action";
import { Button } from "@/app/lib/@frontend/ui/component";
import { ChooseProfileForm } from "@/app/lib/@frontend/ui/form";
import { cn } from "@/app/lib/util";
import { ViewColumnsIcon } from "@heroicons/react/24/outline";
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
      <ul
        role="list"
        className="mt-10 px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {controls.map((control) => (
          <Link
            href={`/admin/control/${control.id}/${profile?.id ?? ""}`}
            key={control.id}
          >
            <li
              key={control.id}
              className="group relative p-6 col-span-1 rounded-lg bg-white shadow hover:cursor-pointer hover:shadow-md"
            >
              <div className="mt-8">
                <h3 className="text-base font-semibold text-gray-900">
                  {control.name}
                </h3>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-6 top-6 text-gray-300 group-hover:text-gray-400"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" className="size-6">
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}
