import {
  analyzeTemporalProductStock,
  countProductTransaction,
  findAllProduct,
  getTotalValueInProductStock,
} from "@/app/lib/@backend/action";
import { MultilineChart, BarChart } from "@/app/lib/@frontend/ui";
import { fillMissingDatesOnProductAnalysisPage } from "@/app/lib/util";
import { ProductSelect } from "./components/productSelect";

interface Props {
  searchParams: {
    id: string;
  };
}
export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const products = await findAllProduct();
  const uiWithNoId = (
    <>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Análise de um produto
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            É apresentado uma visão geral sobre os dados de um produto,
            incluindo tabelas e gráficos.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div className="w-full">
          <ProductSelect products={products} currentProductIdSelected={id} />
        </div>
      </div>
    </>
  );
  if (id) {
    const analyzeActionResult = await analyzeTemporalProductStock(id);
    const countActionResult = await countProductTransaction(id);
    const totalValueActionResult = await getTotalValueInProductStock(id);
    const cumulativeSeries = fillMissingDatesOnProductAnalysisPage(
      analyzeActionResult.result,
      analyzeActionResult.dates,
      (d) => d.cumulative_balance
    );
    const [enterSeries] = fillMissingDatesOnProductAnalysisPage(
      analyzeActionResult.result,
      analyzeActionResult.dates,
      (d) => d.enter
    );
    const [exitSeries] = fillMissingDatesOnProductAnalysisPage(
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
    const statsCost = [
      {
        name: "Quant. Em Estoque",
        value: totalValueActionResult?.balance ?? "--",
      },
      {
        name: "Custo unitário",
        value: totalValueActionResult?.unit_cost
          ? `R$${totalValueActionResult.unit_cost.toFixed(2)}`
          : "--",
      },
      {
        name: "Custo agregado em Estoque",
        value: totalValueActionResult?.total_cost
          ? `R$${totalValueActionResult.total_cost.toFixed(2)}`
          : "--",
      },
    ];
    const statsTransaction = [
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
        <div className="gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Custo
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Confira a quantidade, custo unitário e custo total em estoque desse
            produto.
          </p>
          <dl className="w-full grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-3">
            {statsCost?.map((stat) => (
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
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Transações
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Confira as relações entre entrada e saida desse insumo.
          </p>
          <dl className="w-full grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-4">
            {statsTransaction?.map((stat) => (
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
        </div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Entradas X Saídas
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Gráfico em barras com o balanço de transações do insumo no estoque
              por dia.
            </p>
          </div>
        </div>
        <div
          className="mx-auto w-full grid grid-cols-3 grid-rols-1 gap-6 px-4
sm:px-6 lg:px-8 h-[500px]"
        >
          <div className="col-span-3">
            <MultilineChart
              series={countSeries!}
              options={{
                xaxis: {
                  categories: analyzeActionResult.dates,
                },
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Quantidade em estoque
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Gráfico em barras representando o nivel de estoque do insumo por
              dia.
            </p>
          </div>
        </div>
        <div
          className="mx-auto w-full grid grid-cols-3 grid-rols-1 gap-6 px-4
sm:px-6 lg:px-8 h-[500px]"
        >
          <div className="col-span-3">
            <BarChart
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
