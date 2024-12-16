import {
  findAllInput,
  findAllProduct,
  findOneTechnicalSheet,
} from "@/app/lib/@backend/action";
import { TechnicalSheetUpdateForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const inputs = await findAllInput();
  const products = await findAllProduct();
  const technicalSheet = await findOneTechnicalSheet({ id });

  if (!technicalSheet) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:fPlex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhuma ficha técnica encontrado
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
            Atualização de ficha técnica
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar uma ficha técnica.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <TechnicalSheetUpdateForm
          technicalSheet={technicalSheet}
          inputs={inputs}
          products={products}
        />
      </div>
    </div>
  );
}
