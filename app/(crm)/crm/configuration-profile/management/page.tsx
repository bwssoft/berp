import {
  findManyConfigurationProfile,
  findOneClientWithConfigurationProfile,
} from "@/app/lib/@backend/action";
import ConfigurationProfileTableCrm from "@/app/lib/@frontend/ui/table/engineer/configuration-profile-crm/table";
import Link from "next/link";

interface Props {
  searchParams: {
    document: string;
    configuration_profile_id: string;
  };
}

export default async function Page(props: Props) {
  const {
    searchParams: { document, configuration_profile_id },
  } = props;

  const client = await findOneClientWithConfigurationProfile({
    "document.value": document?.replace(/[./-]/g, ""),
  });

  if (!client) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Cliente não encontrado
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const profilesFromRepository = await findManyConfigurationProfile({
    client_id: client.id,
  });
  const profileProcessed = profilesFromRepository.map((profile) => ({
    ...profile,
    selected: profile.id === configuration_profile_id,
  }));
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Criação de perfil de configuração
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar o perfil de
            configuração.
          </p>
        </div>
        <Link
          key={1}
          href={`/crm/configuration-profile/form/create?document=${client.document.value}`}
          className="ml-auto rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Novo perfil de configuração
        </Link>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ConfigurationProfileTableCrm data={profileProcessed} />
      </div>
    </div>
  );
}
