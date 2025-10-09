"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {IProduct} from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import { useProductionOrderCreateForm } from "./use-production-order-create-form";
import { productionOrderConstants } from "@/app/lib/constant";

export const InputFormSelectPriorityData = [
  { name: "Alta", value: "high" },
  { name: "Média", value: "medium" },
  { name: "Baixa", value: "low" },
];

interface Props {
  products: IProduct[];
}

export function ProductionOrderCreateForm(props: Props) {
  const { products } = props;
  const {
    register,
    handleSubmit,
    productsOnForm,
    handleAppendProduct,
    handleRemoveProduct,
  } = useProductionOrderCreateForm();

  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label
                htmlFor="products"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Produtos
              </label>
              {productsOnForm.map((item, index) => (
                <div key={item.id} className="flex space-x-4 mt-2">
                  <select
                    id={`input-${index}`}
                    className="w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                    {...register(`products.${index}.product_id`)}
                  >
                    <option value={`select-empty-${index}`}>
                      Selecione um Produto
                    </option>
                    {products.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                      Quantidade:
                    </span>
                    <input
                      {...register(`products.${index}.quantity`)}
                      type="number"
                      id="quantity"
                      autoComplete="quantity"
                      className="w-full border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      placeholder="200"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={() => handleRemoveProduct(index)}
                    className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                  >
                    <XMarkIcon width={16} height={16} />
                  </Button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleAppendProduct({
                    product_id: `select-empty-${productsOnForm.length}`,
                    quantity: 0,
                  })
                }
                className="mt-2 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
              >
                Adicionar Produto
              </button>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="priority"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Prioridade
              </label>
              <select
                id="priority"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                {...register("priority")}
              >
                <option>Selecione uma opção</option>
                {Object.entries(productionOrderConstants.priority).map(
                  ([key, value]) => (
                    <option key={key} value={key}>
                      {value}
                    </option>
                  )
                )}
              </select>
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
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                  {...register("description")}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Escreva um pouco sobre a ordem de produção.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Arquivos
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
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
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
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
