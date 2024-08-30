"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { Button } from "../../button";
import { FileUpload } from "../../input-file";
import { useInputCategoryCreateFromFileForm } from "./use-input-category-from-file-form";

export function InputCategoryCreateFromFileForm() {
  const {
    inputs,
    handleFile,
    handleAppendInput,
    handleRemoveInput,
    handleSubmit,
    hookFormReset,
    errors,
    register,
    setValue,
  } = useInputCategoryCreateFromFileForm();

  return (
    <form action={() => handleSubmit()} className="w-full">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <FileUpload handleFile={handleFile} accept=".xlsx" />

            <div className="col-span-full">
              <label htmlFor="inputs" className="block text-sm font-medium leading-6 text-gray-900">
                Categorias de insumos
              </label>

              <div>
                {inputs.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-2 gap-2 mt-8">
                    <div>
                      <label
                        htmlFor="code"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Prefixo do código
                      </label>
                      <input
                        {...register(`inputs.${index}.code`)}
                        type="text"
                        id="code"
                        autoComplete="code"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Código"
                      />
                    </div>
                    <div className="flex items-end gap-2 w-full">
                      <div className="w-full">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nome da categoria
                        </label>
                        <input
                          {...register(`inputs.${index}.name`)}
                          type="text"
                          id="name"
                          autoComplete="name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="Nome"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => handleRemoveInput(index)}
                        className="rounded-full bg-red-600 shadow-sm mb-2 hover:bg-red-500 p-1 h-fit"
                      >
                        <XMarkIcon width={16} height={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  handleAppendInput({
                    code: "",
                    name: "",
                  })
                }
                className="mt-4 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
              >
                Acrescentar categoria na lista
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
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
