"use client";
import { Button } from "../../button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FileUpload } from "../../input-file";
import { useDeviceCreateFromFileForm } from "./use-device-create-from-file-form";

export function DeviceCreateFromFileForm() {
  const {
    handleSubmit,
    register,
    devices,
    handleAppedDevice,
    handleRemoveDevice,
    handleFile,
  } = useDeviceCreateFromFileForm();

  return (
    <form action={() => handleSubmit()} className="w-full">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <FileUpload handleFile={handleFile} accept=".xlsx" />

            <div className="col-span-full">
              <label
                htmlFor="devices"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Insumos
              </label>
              {devices.map((item, index) => (
                <div key={item.id} className="flex space-x-4 mt-2 items-center">
                  <input
                    {...register(`devices.${index}.serial`)}
                    type="text"
                    id="serial"
                    autoComplete="serial"
                    className="block w-full rounded-md border-0 py-1.5 pl-5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Nome"
                  />
                  <select
                    id="model"
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register(`devices.${index}.model`)}
                  >
                    <option value={`model-select-empty-${index}`}>
                      Unidade de medida
                    </option>
                    <option value={"cm"}>Centímetro (cm)</option>
                    <option value={"m"}>Metro (m)</option>
                    <option value={"g"}>Grama (g)</option>
                    <option value={"kg"}>Quilo (kg)</option>
                    <option value={"ml"}>Mililitro (ml)</option>
                    <option value={"l"}>Litro (L)</option>
                    <option value={"un"}>Unidade (un)</option>
                  </select>
                  <Button
                    type="button"
                    onClick={() => handleRemoveDevice(index)}
                    className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                  >
                    <XMarkIcon width={16} height={16} />
                  </Button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleAppedDevice({
                    serial: "",
                    model: `model-select-empty-${devices.length}` as any,
                  })
                }
                className="mt-2 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
              >
                Adicionar equipamento
              </button>
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
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
