import { findAllInput } from "@/app/lib/action";
import { resumeStockByInput } from "@/app/lib/action/input-transaction.action";
import { MultilineChart } from "@/app/ui/chart/multiline.chart";
import { fillMissingDates } from "@/app/util/fillMissingDates";
import { InputSelect } from "./components/inputSelect";
import { BarChart } from "@/app/ui/chart/bar.chart";

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
            Histórico de um insumo
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            É apresentado uma visão geral sobre o hostórico de dados de um
            insumo, com tabelas e gráficos.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div className="w-full">
          <InputSelect inputs={inputs} />
        </div>
      </div>
    </>
  );
  let cumulativeSeries, enterSeries, exitSeries, stats, historic;
  if (id) {
    historic = await resumeStockByInput(id);
    cumulativeSeries = fillMissingDates(
      historic.cumulative,
      historic.dates,
      (d) => d.cumulativeBalance
    );
    [enterSeries] = fillMissingDates(
      historic.cumulative,
      historic.dates,
      (d) => d.enter
    );
    [exitSeries] = fillMissingDates(
      historic.cumulative,
      historic.dates,
      (d) => d.exit
    );
    const inStock = historic.cumulative?.[0]?.balance;
    stats = [
      {
        name: "Valor em estoque",
        value: inStock,
      },
      {
        name: "Total de transações",
        value: historic.count.transactions,
      },
      {
        name: "Total de entradas",
        value: historic.count.enter,
      },
      {
        name: "Total de saídas",
        value: historic.count.exit,
      },
      {
        name: "Relação Entrada x Saída",
        value: historic.count.ratioEnterExit.toFixed(2),
      },
    ];
  }

  return (
    <div className="grid grid-rows-[min_content, min_content, min_content, 1fr, 1fr] h-full gap-6">
      {uiWithNoId}
      {id && (
        <>
          <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-5">
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
sm:px-6 lg:px-8"
          >
            <div className="col-span-3">
              <MultilineChart
                title="Entradas x Saída"
                subtitle="Semanal"
                series={[
                  { ...exitSeries!, color: "#ef4444", name: "Saída" },
                  { ...enterSeries!, color: "#84cc16", name: "Entrada" },
                ]}
                options={{
                  xaxis: {
                    categories: historic!.dates,
                  },
                }}
              />
            </div>
          </div>
          <div
            className="mx-auto w-full grid grid-cols-3 grid-rols-1 gap-6 px-4
sm:px-6 lg:px-8"
          >
            <div className="col-span-3">
              <BarChart
                title="Valor em Estoque"
                subtitle="Semanal - Acumulativo"
                series={cumulativeSeries!}
                options={{
                  xaxis: {
                    categories: historic!.dates,
                  },
                }}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
