import { findOneDevice } from "@/app/lib/@backend/action/engineer/device.action";
import { findManyProduct } from "@/app/lib/@backend/action/engineer/product/product.action";
import { DeviceUpdateForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const device = await findOneDevice({ id });

  if (!device) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhum equipamento encontrado
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const products = await findManyProduct();

  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Atualização de equipamento
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar um equipamento.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <DeviceUpdateForm device={device} products={products} />
      </div>
    </div>
  );
}
