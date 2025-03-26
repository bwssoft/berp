import {
  findAllInputStock,
  getInputStockInsight,
  updateInputStock,
} from "@/app/lib/@backend/action";
import {
  Button,
  BarChart,
  DoughnutChart,
  InputStockTable,
} from "@/app/lib/@frontend/ui/component";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

export default async function Page() {
  const stock = await findAllInputStock();
  const [insights] = await getInputStockInsight();
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Estoque dos insumos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma tabela é apresentada com a quantidade de cada insumo. É
            atualizada a cada 24h a partir das transações realizadas no dia.
          </p>
        </div>
        <form action={updateInputStock} className="ml-auto">
          <Button
            type="submit"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <ArrowPathIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Atualizar Estoque
          </Button>
        </form>
      </div>
      <dl className="mx-auto w-full grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            name: "Valor total em estoque",
            value: insights?.total_value
              ? `R$${insights.total_value.toFixed(2)}`
              : "--",
          },
          {
            name: "Insumo em maior quantidade",
            value: insights?.max_balance?.input.name ?? "--",
          },
          {
            name: "Insumo em menor quantidade",
            value: insights?.min_balance?.input.name ?? "--",
          },
        ].map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">
              {stat.name}
            </dt>
            <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <InputStockTable data={stock} />
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Quantidade em estoque
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Gráfico em barras com a quantidade de cada insumo em estoque.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12 h-[500px]">
        <BarChart
          series={stock.map((s) => ({
            name: s.input.name,
            data: [s.balance],
            color: s.input.color,
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
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Insights pelo preço
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Conjunto de informações sobre a quantidade dos insumos e seus
            valores.
          </p>
        </div>
      </div>
      <dl className="mx-auto w-full flex flex-wrap gap-px bg-gray-900/5">
        {[
          {
            name: `Maior Preço Unitário (R$${insights?.max_unit_price?.value})`,
            value: insights?.max_unit_price?.input.name ?? "--",
          },
          {
            name: `Menor Preço Unitário (R$${insights?.min_unit_price?.value})`,
            value: insights?.min_unit_price?.input.name ?? "--",
          },
        ].map((stat) => (
          <div
            key={stat.name}
            className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">
              {stat.name}
            </dt>
            <dd
              className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900 truncate"
              title={stat.value}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      <dl className="mx-auto w-full flex flex-wrap gap-px bg-gray-900/5">
        {[
          {
            name: `Maior Valor Total em Estoque (R$${insights?.max_cumulative_price?.value})`,
            value: insights?.max_cumulative_price?.input.name ?? "--",
          },
          {
            name: `Menor Valor Total em Estoque (R$${insights?.min_cumulative_price?.value})`,
            value: insights?.min_cumulative_price?.input.name ?? "--",
          },
        ].map((stat) => (
          <div
            key={stat.name}
            className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">
              {stat.name}
            </dt>
            <dd
              className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900 truncate"
              title={stat.value}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
      {/* <dl className="mx-auto w-full flex flex-wrap gap-px bg-gray-900/5">
        {[
          {
            name: "Maior Variação de Estoque",
            value: "Processador XYZ",
          },
          {
            name: "Menor Variação de Estoque",
            value: "Processador XYZ",
          },
        ].map((stat) => (
          <div
            key={stat.name}
            className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm font-medium leading-6 text-gray-500">
              {stat.name}
            </dt>
            <dd
              className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900 truncate"
              title={stat.value}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl> */}
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            R$ em estoque
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Gráficos com os valores de cada insumo em estoque.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12 h-[500px]">
        <BarChart
          series={stock.map((s) => ({
            name: s.input.name,
            data: [s.cumulative_price.toFixed(2)],
            color: s.input.color,
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
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12 h-[500px]">
        <DoughnutChart
          series={stock.map((s) => s.cumulative_price)}
          options={{
            labels: stock.map((s) => s.input.name),
            colors: stock.map((s) => s.input.color),
          }}
        />
      </div>
    </div>
  );
}
