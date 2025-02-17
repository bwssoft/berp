import {
  findOneClient,
  findOneConfigurationProfile,
  findOneTechnology,
} from "@/app/lib/@backend/action";
import { ConfigurationProfileUpdateFromProductionOrderForm } from "@/app/lib/@frontend/ui/form";

interface Props {
  searchParams: {
    configuration_profile_id: string;
    production_order_id: string;
    production_order_line_item_id: string;
  };
}
export default async function Page(props: Props) {
  const {
    searchParams: {
      configuration_profile_id,
      production_order_id,
      production_order_line_item_id,
    },
  } = props;

  const configurationProfile = await findOneConfigurationProfile({
    id: configuration_profile_id,
  });

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

  const [client, technology] = await Promise.all([
    findOneClient({ id: configurationProfile.client_id }),
    findOneTechnology({ id: configurationProfile.technology_id }),
  ]);

  if (!client || !technology) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Algumas informações do perfil de configurações não foram
              encontradas
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
        <ConfigurationProfileUpdateFromProductionOrderForm
          configurationProfile={configurationProfile}
          client={client!}
          technology={technology!}
          productionOrderId={production_order_id}
          lineItemId={production_order_line_item_id}
        />
      </div>
    </div>
  );
}
