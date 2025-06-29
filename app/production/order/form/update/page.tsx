import { findManyProduct } from "@/app/lib/@backend/action/engineer/product/product.action";
import { findOneProductionOrder } from "@/app/lib/@backend/action/production/production-order.action";
import { ProductionOrderUpdateForm } from "@/app/lib/@frontend/ui/component";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const productionOrder = await findOneProductionOrder({ id });

  if (!productionOrder) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhuma Ordem de Produção encontrado
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
            Atualização de ordem de produção
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar uma ordem de produção.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ProductionOrderUpdateForm
          products={products}
          productionOrder={productionOrder}
        />
      </div>
    </div>
  );
}
