import { findAllProduct } from "@/app/lib/action";
import ProductionOrderCreateForm from "@/app/ui/form/production-order/production-order.create.form";

export default async function Page() {
  const products = await findAllProduct();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de ordem de produção
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar uma ordem de produção.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ProductionOrderCreateForm products={products} />
      </div>
    </div>
  );
}