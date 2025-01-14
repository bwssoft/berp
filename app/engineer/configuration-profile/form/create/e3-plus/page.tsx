import { E3PlusConfigurationProfileCreateForm } from "@/app/lib/@frontend/ui/form";

export default async function Page() {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de perfil de configuração E3+
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar um perfil de configuração.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <E3PlusConfigurationProfileCreateForm />
      </div>
    </div>
  );
}
