import { resumeStockByInput } from "@/app/lib/action/input-transaction.action";
import { BarChart } from "@/app/ui/chart/bar.chart";
import { StackedBarChart } from "@/app/ui/chart/stacked-bar.chart";
import { fillMissingDates } from "@/app/util/fillMissingDates";

export default async function Page() {
  const stackedBarChartData = await resumeStockByInput();
  const cumulativeSeries = fillMissingDates(
    stackedBarChartData.cumulative,
    stackedBarChartData.dates,
    (d) => d.cumulativeBalance
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
  const stats = [
    {
      name: "Total de transações",
      value: stackedBarChartData.count.transactions,
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
            Balanço Semanal dos insumos
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Um resumo com gráficos e listas para obter insights sobre a
            quantidade dos insumos.
          </p>
        </div>
      </div>
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
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

      <div className="mx-auto w-full grid grid-cols-3 grid-rols-1 gap-6 px-4 sm:px-6 lg:px-8 h-[500px]">
        <div className="col-span-3">
          <StackedBarChart
            series={cumulativeSeries}
            options={{
              xaxis: {
                categories: stackedBarChartData.dates,
              },
            }}
            title="Balanço Geral"
            subtitle="Semanal - Acumulativo"
          />
        </div>
      </div>

      <div className="mx-auto w-full grid grid-cols-4 grid-rols-1 gap-6 px-4 sm:px-6 lg:px-8 h-[600px]">
        <div className="col-span-2">
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
            title="Entradas"
            subtitle="Semanal"
          />
        </div>
        <div className="col-span-2">
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
            title="Saídas"
            subtitle="Semanal"
          />
        </div>
      </div>
    </div>
  );
}
