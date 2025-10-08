import { findManyProduct } from "@/app/lib/@backend/action/commercial/product/product.action";
import { DeviceCreateForm } from '@/frontend/ui/form/engineer/device/create/device.create.form';


export default async function Page() {
  const { docs: products } = await findManyProduct({ filter: {} });
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de equipamento
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar um equipamento.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <DeviceCreateForm products={products} />
      </div>
    </div>
  );
}
