import { findManyConfigurationProfile } from "@/app/lib/@backend/action";
import { ButtonGroup } from "@/app/lib/@frontend/ui/component";
import ConfigurationProfileTable from "@/app/lib/@frontend/ui/table/engineer/configuration-profile/table";
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
            Uma lista de todos os perfil de configuração registrados na sua conta.
          </p>
        </div>

        <ButtonGroup
          label="Novo perfil de configuração"
          className="ml-auto"
          items={[
            <Link
              key={1}
              href="/engineer/configuration-profile/form/create/e3-plus"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none">
              E3+
            </Link>,
            <Link
              key={2}
              href="/engineer/configuration-profile/form/create/e3-plus-4g"
              className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none">
              E3+4G
            </Link>
          ]}
        />

      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <ConfigurationProfileTable data={confiiguration_profiles} />
      </div>
    </div>
  );
}
