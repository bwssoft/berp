import { findOneClient } from "@/backend/action/commercial/client.action";
import { findOneConfigurationProfile } from "@/backend/action/engineer/configuration-profile.action";
import {
  findManyTechnology,
  findOneTechnology,
} from "@/backend/action/engineer/technology.action";
import { ConfigurationProfileUpdateFromCrmForm } from "@/app/lib/@frontend/ui/form/engineer/configuration-profile/update-from-crm";

interface Props {
  searchParams: {
    id: string;
  };
}
export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;

  const configurationProfile = await findOneConfigurationProfile({ id });

  if (!configurationProfile) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhum perfil de configuração encontrado
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const [technologies, client, technology] = await Promise.all([
    findManyTechnology({}),
    findOneClient({ id: configurationProfile.client_id }),
    findOneTechnology({ id: configurationProfile.technology_id }),
  ]);

  if (!client || !technology) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Algumas informações do perfil não foram encontradas
            </h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Atualização de perfil de configuração
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar o perfil de
            configuração.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ConfigurationProfileUpdateFromCrmForm
          technologies={technologies}
          configurationProfile={configurationProfile}
          technology={technology}
          client={client}
          clients={[]}
        />
      </div>
    </div>
  );
}

