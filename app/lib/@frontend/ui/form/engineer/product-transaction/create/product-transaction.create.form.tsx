"use client";
import { IProduct } from "@/app/lib/@backend/domain";
import { Radio } from "@/app/lib/@frontend/ui";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useProductTransacionCreateForm } from "./use-product-transaction-create-form";
import { Controller } from "react-hook-form";

interface Props {
  products: IProduct[];
}
export function ProductTransactionCreateForm(props: Props) {
  const { products } = props;
  const { handleSubmit, register, control } = useProductTransacionCreateForm();
  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <Radio
                    name="type"
                    label="Tipo"
                    data={[
                      { id: 0, label: "Entrada", value: "enter" },
                      { id: 1, label: "Saída", value: "exit" },
                    ]}
                    defaultCheckedItem={{
                      id: 0,
                      value: "enter",
                      label: "Entrada",
                    }}
                    keyExtractor={(d) => d.id}
                    valueExtractor={(d) => d.value}
                    labelExtractor={(d) => d.label}
                    onChange={(d) => field.onChange(d.value)}
                  />
                )}
              />
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="product_id"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Produto
              </label>
              <select
                {...register("product_id")}
                id="product_id"
                name="product_id"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option>Selecione uma opção</option>
                {products.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Quantidade
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    Quantidade:
                  </span>
                  <input
                    type="number"
                    {...register("quantity")}
                    id="quantity"
                    autoComplete="quantity"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="1"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Documentos
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
                        id="file-upload"
                        {...register("files")}
                        type="file"
                        className="sr-only"
                        multiple={true}
                      />
                    </label>
                    <p className="pl-1">ou arraste e solte</p>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">
                    PNG, JPG, GIF, PDF up to 10MB
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
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Salvar
        </button>
      </div>
    </form>
  );
}
