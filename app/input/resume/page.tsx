import { resumeInputTransactions } from "@/app/lib/action/input/input-transaction.action";
import { BarChart } from "@/app/ui/chart/bar.chart";
import { StackedBarChart } from "@/app/ui/chart/stacked-bar.chart";
import { fillMissingDates } from "@/app/util/fillMissingDates";

export default async function Page() {
  const stackedBarChartData = await resumeInputTransactions();
  const cumulativeSeries = fillMissingDates(
    stackedBarChartData.cumulative,
    stackedBarChartData.dates,
    (d) => d.cumulative_balance
  );
  const enterSeries = fillMissingDates(
    stackedBarChartData.cumulative,
    stackedBarChartData.dates,
    (d) => d.enter
  );
  const exitSeries = fillMissingDates(
    stackedBarChartData.cumulative,
    stackedBarChartData.dates,
    (d) => d.exit
  );
  const inStock = stackedBarChartData.cumulative.reduce(
    (acc, cur) => cur.balance + acc,
    0
  );
  const stats = [
    {
      name: "Quantidade em Estoque",
      value: inStock,
    },
    {
      name: "Total de transações",
      value: stackedBarChartData.count.total,
    },
    {
      name: "Total de entradas",
      value: stackedBarChartData.count.enter,
    },
    {
      name: "Total de saídas",
      value: stackedBarChartData.count.exit,
    },
    {
      name: "Relação Entrada x Saída",
      value: stackedBarChartData.count.ratioEnterExit.toFixed(2),
    },
  ];
  return (
    <div className="grid grid-rows-[min_content, min_content, 1fr, 1fr] h-full gap-6">
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Resumo Semanal das transações dos insumos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Insights com gráficos e listas para obter sobre a transações dos
            insumos do estoque.
          </p>
        </div>
      </div>
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
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
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Balanço das transações dos insumos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Gráfico em barras com o balanço diário das transações de cada
            insumo.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full grid grid-cols-3 grid-rols-1 gap-6 px-4 sm:px-6 lg:px-8 h-[500px]">
        <div className="col-span-3">
          <StackedBarChart
            series={cumulativeSeries}
            options={{
              xaxis: {
                categories: stackedBarChartData.dates,
              },
            }}
          />
        </div>
      </div>

      <div className="mx-auto w-full grid grid-cols-4 grid-rols-1 gap-6 px-4 sm:px-6 lg:px-8 h-[600px]">
        <div className="col-span-2">
          <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <div>
              <h1 className="text-base font-semibold leading-7 text-gray-900">
                Entradas
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Gráfico em barras que representa as entradas de insumos no
                estoque.
              </p>
            </div>
          </div>
          <BarChart
            series={enterSeries}
            options={{
              xaxis: {
                categories: stackedBarChartData.dates,
              },
              chart: {
                stacked: true,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
            }}
          />
        </div>
        <div className="col-span-2">
          <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
            <div>
              <h1 className="text-base font-semibold leading-7 text-gray-900">
                Saídas
              </h1>
              <p className="mt-2 text-sm text-gray-700">
                Gráfico em barras que representa as saídas de insumos no
                estoque.
              </p>
            </div>
          </div>
          <BarChart
            series={exitSeries}
            options={{
              xaxis: {
                categories: stackedBarChartData.dates,
              },
              chart: {
                stacked: true,
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
