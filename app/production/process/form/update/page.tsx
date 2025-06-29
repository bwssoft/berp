import { findOneProductionProcess } from "@/app/lib/@backend/action/production/production-process.action";
import { ProductionProcessUpdateForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const productionProcess = await findOneProductionProcess({ id });

  if (!productionProcess) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:fPlex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhum processo de produção encontrado
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
            Atualização de processo de produção
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar uma ordem de produção.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ProductionProcessUpdateForm productionProcess={productionProcess} />
      </div>
    </div>
  );
}
