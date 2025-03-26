"use client";
import { IInput, IProduct, ITechnicalSheet } from "@/app/lib/@backend/domain";
import { Controller } from "react-hook-form";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { FileUpload } from "@/app/lib/@frontend/ui/component/input-file";
import { useTechnicalSheetUpdateForm } from "./use-technical-sheet-update-form";

type TechnicalSheetUpdateFormProps = {
  technicalSheet: ITechnicalSheet;
  inputs: IInput[];
  products: IProduct[];
};

export function TechnicalSheetUpdateForm({
  technicalSheet,
  inputs,
  products,
}: TechnicalSheetUpdateFormProps) {
  const {
    register,
    handleSubmit,
    control,
    handleAppendInput,
    handleUpdateInput,
    inputsFields,
    handleFile,
  } = useTechnicalSheetUpdateForm({ technicalSheet, inputs });

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
                Nome da ficha técnica
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="E3+"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-medium leading-6 text-gray-900">
                Produto
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <Controller
                    control={control}
                    name="product_id"
                    render={({ field }) => (
                      <select
                        className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}
                      >
                        <option value={""}>Selecione um dos produtos</option>

                        {products.map((productData) => (
                          <option key={productData.id} value={productData.id}>
                            {productData.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <h2 className="block text-sm font-medium leading-6 text-gray-900">
                Insumos
              </h2>

              <FileUpload
                accept=".xlsx"
                handleFile={handleFile}
                element={({ upload }) => (
                  <p className="text-sm leading-6 text-gray-600">
                    <a
                      href="/xlsx/create-product-input-upload.xlsx"
                      download={"create-product-input-upload.xlsx"}
                      className="underline cursor-pointer font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                    >
                      Baixe o modelo
                    </a>{" "}
                    para preencher o campo a partir de um arquivo xlsx.{" "}
                    <a
                      className="underline cursor-pointer font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                      onClick={upload}
                    >
                      Click aqui para fazer o upload.
                    </a>
                  </p>
                )}
              />

              {inputsFields.map((input, inputIndex) => (
                <div
                  key={input.id}
                  className="flex flex-row gap-2 items-end justify-between"
                >
                  <Controller
                    control={control}
                    name="inputs"
                    render={() => (
                      <select
                        id={input.id}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm sm:leading-6"
                        value={inputsFields[inputIndex].uuid}
                        onChange={(event) => {
                          handleUpdateInput({
                            uuid: event.target.value,
                            quantity: 0,
                            stepIndex: inputIndex,
                          });
                        }}
                      >
                        <option value={""}>Selecione um dos insumos</option>

                        {inputs.map((inputData) => (
                          <option key={inputData.id} value={inputData.id}>
                            {inputData.name}
                          </option>
                        ))}
                      </select>
                    )}
                  />

                  <input
                    type="number"
                    placeholder="Qtd."
                    className="w-28 py-1.5 pl-3 h-9 rounded-md placeholder:text-gray-400"
                    value={inputsFields[inputIndex].quantity}
                    onChange={(event) =>
                      handleUpdateInput({
                        stepIndex: inputIndex,
                        uuid: inputsFields[inputIndex].uuid,
                        quantity: Number(event.target.value),
                      })
                    }
                  />
                </div>
              ))}

              <Button
                className="mt-4 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                onClick={() => handleAppendInput()}
                type="button"
              >
                Adicionar insumo
              </Button>
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
