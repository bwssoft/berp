import { findAllInput } from "@/app/lib/action";
import { MultilineChart } from "@/app/ui/chart/multiline.chart";
import { fillMissingDatesOnAnalysisPage } from "@/app/util/fillMissingDates";
import { InputSelect } from "./components/inputSelect";
import { BarChart } from "@/app/ui/chart/bar.chart";
import {
  analyzeTemporalStock,
  getTotalValueInStock,
} from "@/app/lib/action/stock.action";
import { countInputTransaction } from "@/app/lib/action/input-transaction.action";

interface Props {
  searchParams: {
    id: string;
  };
}
export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const inputs = await findAllInput();
  const uiWithNoId = (
    <>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Análise de um insumo
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            É apresentado uma visão geral sobre os dados de um insumo, incluindo
            tabelas e gráficos.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div className="w-full">
          <InputSelect inputs={inputs} currentInputIdSelected={id} />
        </div>
      </div>
    </>
  );
  if (id) {
    const analyzeActionResult = await analyzeTemporalStock(id);
    const countActionResult = await countInputTransaction(id);
    const totalValueActionResult = await getTotalValueInStock(id);
    const cumulativeSeries = fillMissingDatesOnAnalysisPage(
      analyzeActionResult.result,
      analyzeActionResult.dates,
      (d) => d.cumulative_balance
    );
    const [enterSeries] = fillMissingDatesOnAnalysisPage(
      analyzeActionResult.result,
      analyzeActionResult.dates,
      (d) => d.enter
    );
    const [exitSeries] = fillMissingDatesOnAnalysisPage(
      analyzeActionResult.result,
      analyzeActionResult.dates,
      (d) => d.exit
    );
    const countSeries = [
      ...(exitSeries
        ? [{ ...exitSeries, color: "#ef4444", name: "Saída" }]
        : [{ data: [], color: "#ef4444", name: "Saída" }]),
      ...(enterSeries
        ? [{ ...enterSeries, color: "#84cc16", name: "Entrada" }]
        : [{ data: [], color: "#84cc16", name: "Entrada" }]),
    ];
    const stats = [
      {
        name: "Quant. Em Estoque",
        value: totalValueActionResult?.available_balance ?? "--",
      },
      {
        name: "R$ em Estoque",
        value: totalValueActionResult?.cumulative_price
          ? `R$${totalValueActionResult.cumulative_price.toFixed(2)}`
          : "--",
      },
      {
        name: "Total Transações",
        value: countActionResult?.total ?? "--",
      },
      {
        name: "Total de entradas",
        value: countActionResult?.enter ?? "--",
      },
      {
        name: "Total de saídas",
        value: countActionResult?.exit ?? "--",
      },
      {
        name: "Entrada x Saída",
        value: countActionResult?.ratioEnterExit.toFixed(2) ?? "--",
      },
    ];
    return (
      <div className="grid grid-rows-[min_content, min_content, min_content, 1fr, 1fr] h-full gap-6">
        {uiWithNoId}
        <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-6">
          {stats?.map((stat) => (
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
        <div
          className="mx-auto w-full grid grid-cols-3 grid-rols-1 gap-6 px-4
sm:px-6 lg:px-8 h-[500px]"
        >
          <div className="col-span-3">
            <MultilineChart
              title="Entradas x Saída"
              subtitle="Semanal"
              series={countSeries!}
              options={{
                xaxis: {
                  categories: analyzeActionResult.dates,
                },
              }}
            />
          </div>
        </div>
        <div
          className="mx-auto w-full grid grid-cols-3 grid-rols-1 gap-6 px-4
sm:px-6 lg:px-8 h-[500px]"
        >
          <div className="col-span-3">
            <BarChart
              title="Quantidade em Estoque"
              subtitle="Semanal - Acumulativo"
              series={cumulativeSeries!}
              options={{
                xaxis: {
                  categories: analyzeActionResult.dates,
                },
                chart: {
                  stacked: false,
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

  return (
    <div className="grid grid-rows-[min_content, min_content, min_content, 1fr, 1fr] h-full gap-6">
      {uiWithNoId}
    </div>
  );
}
