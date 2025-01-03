import { findManyProduct, findOneConfigurationProfile } from "@/app/lib/@backend/action";
import { DeviceUpdateForm, E3PlusConfigurationProfileUpdateForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const configuration_profile = await findOneConfigurationProfile({ id });

  if (!configuration_profile) {
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

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Atualização de perfil de configuração
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar um perfil de configuração.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <E3PlusConfigurationProfileUpdateForm configuration_profile={configuration_profile} />
      </div>
    </div>
  );
}
