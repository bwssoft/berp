"use client";
import { ITechnicalSheetWithInputs } from "@/app/lib/@backend/usecase";
import { Controller } from "react-hook-form";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { BarChart, DoughnutChart } from "../../../../chart";
import { Stat } from "../../../../component/stat";
import { useProductCreateForm } from "./use-product-create-form";

interface Props {
  technicalSheets: ITechnicalSheetWithInputs[];
}

export function ProductCreateForm(props: Props) {
  const { technicalSheets } = props;
  const { register, handleSubmit, insights, control } = useProductCreateForm();

  const { merged, stats, totalCost, averageCost } = insights;

  return (
    <div className="w-full flex flex-col gap-6">
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
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Ficha técnica
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <Controller
                      control={control}
                      name="technical_sheet"
                      render={({ field }) => (
                        <select
                          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={field.value?.id}
                          onChange={(event) => {
                            const currentTechnicalSheet = technicalSheets.find(
                              (item) => item.id === event.target.value
                            );

                            field.onChange(currentTechnicalSheet);
                          }}
                        >
                          <option value={""}>
                            Selecione uma ficha técnica
                          </option>

                          {technicalSheets.map((technicalSheetData) => (
                            <option
                              key={technicalSheetData.id}
                              value={technicalSheetData.id}
                            >
                              {technicalSheetData.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
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
      <div className="flex flex-wrap items-center gap-6 sm:flex-nowrap space-y-12">
        <div className="h-[500px] grid grid-rows-[min-content_1fr] w-full gap-6">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Insumo x Quantidade
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Gráfico com a quantidade de cada insumo.
            </p>
          </div>
          <BarChart
            series={merged.map((i) => ({
              name: i.name,
              data: [i.quantity],
              color: i.color!,
            }))}
            options={{
              xaxis: { categories: [""] },
              chart: { stacked: false },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
              stroke: {
                width: 5,
              },
            }}
          />
        </div>
        <div className="h-[500px] grid grid-rows-[min-content_1fr] w-full gap-6">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Insumo x Preço
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Gráfico com o preço total de cada insumo.
            </p>
          </div>
          <DoughnutChart
            series={merged.map((i) => {
              return i.total;
            })}
            options={{
              labels: merged.map((i) => {
                return i.name;
              }),
              colors: merged.map((i) => {
                return i.color;
              }),
            }}
          />
        </div>
      </div>
      <div>
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Insights
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Cards com valores gerais sobre o produto.
          </p>
        </div>
        <dl className="mx-auto w-full flex flex-wrap gap-px bg-gray-900/5">
          <Stat name="Custo Total" value={`R$ ${totalCost.toFixed(2)}`} />
          <Stat
            name="Média por insumo"
            value={`R$ ${averageCost.toFixed(2)}`}
          />
        </dl>
        <dl className="mx-auto w-full flex flex-wrap gap-px bg-gray-900/5">
          {stats.map((stat) => (
            <Stat {...stat} key={stat.name} />
          ))}
        </dl>
      </div>
    </div>
  );
}
