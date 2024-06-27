"use client";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useInputCreateForm } from "./useInputCreateForm";
import { Button } from "../../button";
import { tailwindColors } from "@/app/constant/tailwind-colors";

export const InputFormSelectColorsData = [
  { name: "Ardósia", value: tailwindColors["slate"][500] },
  { name: "Cinza", value: tailwindColors["gray"][500] },
  { name: "Zinco", value: tailwindColors["zinc"][500] },
  { name: "Neutro", value: tailwindColors["neutral"][500] },
  { name: "Pedra", value: tailwindColors["stone"][500] },
  { name: "Vermelho", value: tailwindColors["red"][500] },
  { name: "Laranja", value: tailwindColors["orange"][500] },
  { name: "Âmbar", value: tailwindColors["amber"][500] },
  { name: "Amarelo", value: tailwindColors["yellow"][500] },
  { name: "Lima", value: tailwindColors["lime"][500] },
  { name: "Verde", value: tailwindColors["green"][500] },
  { name: "Esmeralda", value: tailwindColors["emerald"][500] },
  { name: "Cerceta", value: tailwindColors["teal"][500] },
  { name: "Ciano", value: tailwindColors["cyan"][500] },
  { name: "Céu", value: tailwindColors["sky"][500] },
  { name: "Azul", value: tailwindColors["blue"][500] },
  { name: "Índigo", value: tailwindColors["indigo"][500] },
  { name: "Violeta", value: tailwindColors["violet"][500] },
  { name: "Roxo", value: tailwindColors["purple"][500] },
  { name: "Fúcsia", value: tailwindColors["fuchsia"][500] },
  { name: "Rosa", value: tailwindColors["pink"][500] },
];

export default function InputCreateForm() {
  const { handleSubmit, register } = useInputCreateForm();
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
                    placeholder="cabo"
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
                <option>Selecione uma opção</option>
                <option value={"un"}>unidade (un)</option>
                <option value={"m"}>metro (m)</option>
                <option value={"cm"}>centímetro (cm)</option>
                <option value={"l"}>litro (L)</option>
                <option value={"ml"}>mililitro (ml)</option>
              </select>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="color"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Cor
              </label>
              <select
                id="color"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                {...register("color")}
              >
                <option>Defina uma cor para o insumo</option>
                {InputFormSelectColorsData.map((c, idx) => (
                  <option key={idx} value={c.value}>
                    {c.name}
                  </option>
                ))}
              </select>
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
