"use client";
import { Button } from "../../button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useInputCreateFromFileForm } from "./use-input-create-from-file-form";
import { FileUpload } from "../../input-file";

export function InputCreateFromFileForm() {
  const {
    handleSubmit,
    register,
    inputs,
    handleAppedInput,
    handleRemoveInput,
    handleFile,
  } = useInputCreateFromFileForm();

  return (
    <form action={() => handleSubmit()} className="w-full">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <FileUpload handleFile={handleFile} />

            <div className="col-span-full">
              <label
                htmlFor="inputs"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Insumos
              </label>
              {inputs.map((item, index) => (
                <div key={item.id} className="flex space-x-4 mt-2 items-center">
                  <input
                    {...register(`inputs.${index}.name`)}
                    type="text"
                    id="name"
                    autoComplete="name"
                    className="block w-full rounded-md border-0 py-1.5 pl-5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Nome"
                  />
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">R$</span>
                    </div>
                    <input
                      type="text"
                      {...register(`inputs.${index}.price`)}
                      id="price"
                      className="block w-full rounded-md border-0 py-1.5 pl-10 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="0.00"
                      aria-describedby="price-currency"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                      <span
                        className="text-gray-500 sm:text-sm"
                        id="price-currency"
                      >
                        BRL
                      </span>
                    </div>
                  </div>
                  <select
                    id="measure_unit"
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    {...register(`inputs.${index}.measure_unit`)}
                  >
                    <option value={`measure_unit-select-empty-${index}`}>
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
                  <input
                    id="color"
                    className="block w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-400 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    type="text"
                    disabled={true}
                    placeholder="Cor"
                    {...register(`inputs.${index}.color`)}
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveInput(index)}
                    className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                  >
                    <XMarkIcon width={16} height={16} />
                  </Button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleAppedInput({
                    name: "",
                    price: "" as any,
                    measure_unit:
                      `measure_unit-select-empty-${inputs.length}` as any,
                    color: "",
                  })
                }
                className="mt-2 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
              >
                Adicionar insumo
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
