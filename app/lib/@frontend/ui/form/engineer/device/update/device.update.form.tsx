"use client";
import { IProduct } from "@/backend/domain/commercial/entity/product.definition";
import { IDevice } from "@/backend/domain/engineer/entity/device.definition";
import { useDeviceUpdateForm } from "./use-device-update-form";
import { Button } from "@/app/lib/@frontend/ui/component/button";

interface Props {
  device: IDevice;
  products: IProduct[];
}
export function DeviceUpdateForm(props: Props) {
  const { device, products } = props;
  const { handleSubmit, register } = useDeviceUpdateForm({
    defaultValues: device,
  });
  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="serial"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Serial
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    serial:
                  </span>
                  <input
                    {...register("serial")}
                    type="text"
                    id="serial"
                    autoComplete="serial"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Cabo"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="product_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Modelo
              </label>
              <select
                id="product_id"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                {...register("product_id")}
              >
                {products.map((p) => (
                  <option id={p.id} key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancelar
        </button>
        <Button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}

