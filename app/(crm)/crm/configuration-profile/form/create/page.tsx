import { findOneClientWithConfigurationProfile } from "@/backend/action/commercial/client.action";
import { findManyTechnology } from "@/backend/action/engineer/technology.action";
import { ConfigurationProfileCreateFromCrmForm } from "@/app/lib/@frontend/ui/form/engineer/configuration-profile/create-from-crm";

interface Props {
  searchParams: {
    document: string;
  };
}

export default async function Page(props: Props) {
  const {
    searchParams: { document },
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

  const technologies = await findManyTechnology({});

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
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ConfigurationProfileCreateFromCrmForm
          technologies={technologies}
          client={client}
        />
      </div>
    </div>
  );
}

