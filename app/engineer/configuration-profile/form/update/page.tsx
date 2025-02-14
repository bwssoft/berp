import {
  findManyClient,
  findManyTechnology,
  findOneConfigurationProfile,
} from "@/app/lib/@backend/action";
import { ConfigurationProfileUpdateForm } from "@/app/lib/@frontend/ui/form";

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

  const [clients, technologies] = await Promise.all([
    findManyClient({}),
    findManyTechnology(),
  ]);

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
        <ConfigurationProfileUpdateForm
          clients={clients}
          technologies={technologies}
          configurationProfile={configurationProfile}
        />
      </div>
    </div>
  );
}
