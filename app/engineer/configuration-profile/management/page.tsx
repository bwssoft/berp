import { findManyConfigurationProfile } from "@/app/lib/@backend/action";
import ConfigurationProfileTable from "@/app/lib/@frontend/ui/table/engineer/configuration-profile/table";
import { PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function Example() {
  const confiiguration_profiles = await findManyConfigurationProfile({});
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Gestão de perfil de configuração
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os perfil de configuração registrados na sua
            conta.
          </p>
        </div>

        <Link
          href="/engineer/configuration-profile/form/create"
          className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
          Novo perfil de configuração
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <ConfigurationProfileTable data={confiiguration_profiles} />
      </div>
    </div>
  );
}
