"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { IInput } from "@/app/lib/@backend/domain";
import { useInputUpdateForm } from "./use-input-update-form";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  input: IInput;
}
export function InputUpdateForm(props: Props) {
  const { input } = props;
  const {
    handleSubmit,
    register,
    handleRemoveManufacturer,
    handleAppedManufacturer,
    manufacturer,
  } = useInputUpdateForm({
    defaultValues: input,
  });
  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <div className="flex rounded-md shadow-sm sm:max-w-md">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  Código do Insumo:
                </span>
                <input
                  value={`${input.category.toUpperCase()}${input.code
                    .toString()
                    .padStart(3, "0")}`}
                  type="text"
                  id="name"
                  autoComplete="name"
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  readOnly={true}
                />
              </div>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nome
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    Insumo:
                  </span>
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Cabo"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="measure_unit"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Unidade de medida
              </label>
              <select
                id="measure_unit"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("measure_unit")}
              >
                <option value={"cm"}>Centímetro (cm)</option>
                <option value={"m"}>Metro (m)</option>
                <option value={"g"}>Grama (g)</option>
                <option value={"kg"}>Quilo (kg)</option>
                <option value={"ml"}>Mililitro (ml)</option>
                <option value={"l"}>Litro (L)</option>
                <option value={"un"}>Unidade (un)</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="color"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cor
              </label>
              <input
                id="color"
                type="color"
                className="block mt-2 w-full rounded-md border-0 py-1 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent"
                {...register("color")}
              />
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Preço
              </label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="text"
                  {...register("price")}
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
            </div>

            <div className="col-span-full">
              <label
                htmlFor="manufacturer"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Fornecedores
              </label>
              {manufacturer.map((item, index) => (
                <div key={item.id} className="flex space-x-4 mt-2 items-center">
                  <input
                    {...register(`manufacturer.${index}.code`)}
                    type="text"
                    id="code"
                    autoComplete="code"
                    className="block w-full rounded-md border-0 py-1.5 pl-5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Part Number"
                  />
                  <input
                    {...register(`manufacturer.${index}.name`)}
                    type="text"
                    id="name"
                    autoComplete="name"
                    className="block w-full rounded-md border-0 py-1.5 pl-5 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Nome"
                  />
                  <Button
                    type="button"
                    onClick={() => handleRemoveManufacturer(index)}
                    className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                  >
                    <XMarkIcon width={16} height={16} />
                  </Button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleAppedManufacturer({
                    name: "",
                    code: "",
                  })
                }
                className="mt-2 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
              >
                Adicionar Fornecedor
              </button>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Descrição
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                  {...register("description")}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Escreva um pouco sobre o insumo.
              </p>
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
