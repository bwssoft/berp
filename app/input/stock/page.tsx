import { getMostRecentStock, updateStock } from "@/app/lib/action/stock.action";
import { Button } from "@/app/ui/button";
import { BarChart } from "@/app/ui/chart/bar.chart";
import StockTable from "@/app/ui/table/stock/table";
import { ArrowPathIcon } from "@heroicons/react/20/solid";

export default async function Page() {
  const stock = await getMostRecentStock();
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
        <form action={updateStock} className="ml-auto">
          <Button
            type="submit"
            className="ml-auto flex items-center gap-x-1 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <ArrowPathIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Atualizar Estoque
          </Button>
        </form>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <StockTable data={stock} />
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12 h-[500px]">
        <BarChart
          series={stock.map((s) => ({
            name: s.input.name,
            data: [s.cumulative_balance],
          }))}
          // series={[
          //   { data: stock.map((s) => s.cumulative_balance), name: "Acumulado" },
          // ]}
          options={{
            // xaxis: { categories: stock.map((s) => s.input.name) },
            xaxis: { categories: [""] },
            chart: { stacked: false },
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
          }}
          title="Quantidade de Insumos"
          subtitle="Valor geral para quantidade de cada insumo do estoque."
        />
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <BarChart
          series={stock.map((s) => ({
            name: s.input.name,
            data: [s.cumulative_balance],
          }))}
          options={{
            xaxis: { categories: [""] },
            chart: { stacked: true },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
}
