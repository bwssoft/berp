"use client";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { commonConstants } from "@/app/lib/constant";
import { useCreateFromFileComponentForm } from "./use-create-from-file.component.form";
import { IComponentCategory } from "@/app/lib/@backend/domain";
import { FileUpload } from '@/frontend/ui/component/input-file';


interface Props {
  categories: IComponentCategory[];
}

export function CreateFromFileComponentForm(props: Props) {
  const { categories } = props;
  const {
    handleSubmit,
    register,
    components,
    handleAppedComponent,
    handleRemoveComponent,
    handleFile,
  } = useCreateFromFileComponentForm({ categories });

  return (
    <form action={() => handleSubmit()} className="w-full">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <FileUpload handleFile={handleFile} accept=".xlsx" />

            <div className="col-span-full">
              <label
                htmlFor="components"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Insumos
              </label>
              <div>
                {components.map((item, index) => (
                  <div key={item.id} className="flex flex-col mt-8 space-y-2">
                    <div className="flex space-x-4 items-center">
                      <select
                        id="category"
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                        {...register(`components.${index}.category`)}
                      >
                        <option value={`category-select-empty-${index}`}>
                          Categoria
                        </option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.code}>
                            {c.code} - {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        {...register(`components.${index}.name`)}
                        type="text"
                        id="name"
                        autoComplete="name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                        placeholder="Nome"
                      />
                      <div className="relative w-full">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">R$</span>
                        </div>
                        <input
                          type="text"
                          {...register(`components.${index}.price`)}
                          id="price"
                          className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                        {...register(`components.${index}.measure_unit`)}
                      >
                        <option value={`measure_unit-select-empty-${index}`}>
                          Unidade de medida
                        </option>
                        {Object.entries(commonConstants.measure_unit).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                      <input
                        id="color"
                        className="block w-fit rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-400 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                        type="text"
                        disabled={true}
                        placeholder="Cor"
                        {...register(`components.${index}.color`)}
                      />
                      <Button
                        type="button"
                        onClick={() => handleRemoveComponent(index)}
                        className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                      >
                        <XMarkIcon width={16} height={16} />
                      </Button>
                    </div>
                    <div>
                      {item.manufacturer.map((item, idx) => (
                        <div
                          key={item.code}
                          className="flex space-x-4 mt-2 items-center"
                        >
                          <input
                            {...register(
                              `components.${index}.manufacturer.${idx}.name`
                            )}
                            type="text"
                            id="name"
                            autoComplete="name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="Nome"
                          />
                          <input
                            {...register(
                              `components.${index}.manufacturer.${idx}.code`
                            )}
                            type="text"
                            id="code"
                            autoComplete="code"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="Part Number"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  handleAppedComponent({
                    name: "",
                    price: "" as any,
                    measure_unit:
                      `measure_unit-select-empty-${components.length}` as any,
                    color: "",
                    manufacturer: [],
                    active: true,
                    category:
                      `category-select-empty-${components.length}` as any,
                  })
                }
                className="mt-4 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
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
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
