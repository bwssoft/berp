"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { useProductCreateForm } from "./use-product-create-form";
import { IInput, IProductCategory } from "@/app/lib/@backend/domain";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/app/lib/util";
import { nanoid } from "nanoid";

interface Props {
  inputs: IInput[];
  categories: IProductCategory[];
}

export function ProductCreateForm(props: Props) {
  const { inputs, categories } = props
  const {
    register,
    handleSubmit,
    bom,
    handleAppendBom,
    handleRemoveBom,
    process_execution,
    handleAppendProcessToProduce,
    handleRemoveProcessToProduce
  } = useProductCreateForm();
  return (
    <div className="w-full flex flex-col gap-6">
      <form action={() => handleSubmit()}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Nome
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                      Produto:
                    </span>
                    <input
                      {...register("name")}
                      type="text"
                      id="name"
                      autoComplete="name"
                      className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="E3+"
                    />
                  </div>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Categoria
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="category"
                    {...register("category")}
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    {categories.map(c => <option key={c.id} value={c.code}>{c.name} ({c.code})</option>)}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="color"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cor
                </label>
                <div className="mt-2 ">
                  <input
                    id="color"
                    type="color"
                    className="block w-full rounded-md border-0 py-1 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-transparent"
                    {...register("color")}
                  />
                </div>
              </div>
              <div className="sm:col-span-3">
                <label htmlFor="price" className="block text-sm/6 font-medium text-gray-900">
                  Preço
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    id="price"
                    step={"0.05"}
                    {...register("price")}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
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
                  Escreva um pouco sobre o produto.
                </p>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <div className="w-full flex flex-col items-start">
              <h1 className="text-base font-semibold leading-7 text-gray-900">
                Processo para produzir
              </h1>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Insira as etapas necessárias para produção desse produto.
              </p>
            </div>
            <div className="mt-4">
              <div className="col-span-full space-y-4">
                {process_execution.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 lg:flex lg:items-end lg:justify-between lg:gap-4 mb-2"
                  >
                    <div className="grid grid-cols-1 gap-4 items-end flex-grow">
                      {/* Etapa */}
                      <div className="col-span-full">
                        {index === 0 && (
                          <label
                            htmlFor="process_execution_step"
                            className="block text-xs font-medium leading-6 text-gray-900"
                          >
                            Etapas
                          </label>
                        )}
                        <input
                          id="process_execution_step"
                          className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
                          placeholder={`${index + 1}ª Etapa`}
                          {...register(`process_execution.${index}.step`)}
                        />
                      </div>
                    </div>

                    {/* Botão Remover */}
                    <div className="mt-4 lg:mt-0">
                      <Button
                        type="button"
                        onClick={() => handleRemoveProcessToProduce(index)}
                        className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                      >
                        <XMarkIcon width={16} height={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={cn(
                  "border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
                  process_execution.length > 0 && "mt-4"
                )}
                onClick={() =>
                  handleAppendProcessToProduce({
                    id: nanoid(),
                    step: "",
                  })
                }
              >
                Adicionar linha
              </button>
            </div>

          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <div className="w-full flex flex-col items-start">
              <h1 className="text-base font-semibold leading-7 text-gray-900">
                B.O.M
              </h1>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Insira os insumos desse produto.
              </p>
            </div>
            <div className="mt-4">
              <div className="col-span-full space-y-4">
                {bom.map((item, index) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-1 lg:flex lg:items-end lg:justify-between lg:gap-4 mb-2"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end flex-grow">

                      {/* Insumo */}
                      <div className="col-span-full lg:col-span-1">
                        {index === 0 && (
                          <label
                            htmlFor="input_id"
                            className="block text-xs font-medium leading-6 text-gray-900"
                          >
                            Insumo
                          </label>
                        )}
                        <select
                          id="input_id"
                          className="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
                          {...register(`bom.${index}.input_id`)}
                        >
                          {inputs.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Quantidade */}
                      <div className="col-span-full lg:col-span-1 lg:w-1/3">
                        {index === 0 && (
                          <label
                            htmlFor="quantity"
                            className="block text-xs font-medium leading-6 text-gray-900"
                          >
                            Quantidade
                          </label>
                        )}
                        <input
                          type="number"
                          id="quantity"
                          className="block w-full rounded-md border-0 py-1.5 px-5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-xs sm:leading-6"
                          placeholder="Quantidade"
                          {...register(`bom.${index}.quantity`)}
                        />
                      </div>
                    </div>

                    {/* Botão Remover */}
                    <div className="mt-4 lg:mt-0">
                      <Button
                        type="button"
                        onClick={() => handleRemoveBom(index)}
                        className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                      >
                        <XMarkIcon width={16} height={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={cn(
                  "border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2",
                  bom.length > 0 && "mt-4"
                )}
                onClick={() =>
                  handleAppendBom({
                    input_id: "",
                    quantity: 0,
                  })
                }
              >
                Adicionar linha
              </button>
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
    </div>
  );
}
