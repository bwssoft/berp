import { findOneInput } from "@/app/lib/@backend/action";
import { InputUpdateForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: {
    id: string;
  };
}
export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const input = await findOneInput({ id });

  if (!input) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhum insumo encontrado
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
            Atualização de insumos
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar um insumo.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <InputUpdateForm input={input} />
      </div>
    </div>
  );
}
