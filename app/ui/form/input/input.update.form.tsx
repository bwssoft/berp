"use client";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { Button } from "../../button";
import { IInput } from "@/app/lib/definition";
import { useInputUpdateForm } from "./useInputUpdateForm";
import { tailwindColorInHex } from "@/app/constant";

interface Props {
  input: IInput;
}
export default function InputUpdateForm(props: Props) {
  const { input } = props;
  const { handleSubmit, register } = useInputUpdateForm({
    defaultValues: input,
  });
  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Imagens
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Selecione o arquivo</span>
                      <input
                        {...register("files")}
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        multiple={true}
                      />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
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
