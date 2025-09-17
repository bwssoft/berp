import {
  findManyClient,
  findOneClient,
} from "@/app/lib/@backend/action/commercial/client.action";
import { findOneConfigurationProfile } from "@/app/lib/@backend/action/engineer/configuration-profile.action";
import {
  findManyTechnology,
  findOneTechnology,
} from "@/app/lib/@backend/action/engineer/technology.action";
import { ConfigurationProfileUpsertForm } from "@/app/lib/@frontend/ui/form";

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

  const [clients, technologies, client, technology] = await Promise.all([
    findManyClient({}),
    findManyTechnology({}),
    findOneClient({ id: configurationProfile.client_id }),
    findOneTechnology({ id: configurationProfile.technology_id }),
  ]);

  if (!technology) {
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
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Atualização de Perfil de Configuração
          </h1>
          <p className="text-muted-foreground">
            Atualizar o perfil para configuração de equipamentos IoT
          </p>
        </div>
        <ConfigurationProfileUpsertForm
          clients={clients}
          technologies={technologies}
          defaultValues={{ configurationProfile, client, technology }}
        />
      </div>
    </div>
  );
}
