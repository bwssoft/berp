import { findManyClient, findManyTechnology } from "@/app/lib/@backend/action";
import { ConfigurationProfileCreateForm } from "@/app/lib/@frontend/ui/form";

export default async function Page() {
  const [clients, technologies] = await Promise.all([
    findManyClient({}),
    findManyTechnology(),
  ]);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de perfil de configuração
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar um novo perfil de
            configuração.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ConfigurationProfileCreateForm
          clients={clients}
          technologies={technologies}
        />
      </div>
    </div>
  );
}
