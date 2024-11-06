import { findAllProductionOrderWithProduct } from "@/app/lib/@backend/action";
import { BarChart } from "@/app/lib/@frontend/ui";
import PieChart from "@/app/lib/@frontend/ui/chart/pie.chart";
import { productionOrderConstants } from "@/app/lib/constant";
import { getRandomHexColor } from "@/app/lib/util";

export default async function Page() {
    const productionOrders = await findAllProductionOrderWithProduct();

    const productionOrdersByStage = productionOrders.reduce((acc, current) => {
        acc[productionOrderConstants.stage[current.stage]] =
            (acc[productionOrderConstants.stage[current.stage]] ?? 0) + 1;

        return acc;
    }, {} as Record<string, number>);

    const productsQuantity = productionOrders.reduce((acc, current) => {
        const productsWithQuantities = current.sale_order.products;
        const currentItemProductsMetadata = current.products_in_sale_order;

        productsWithQuantities.forEach((product) => {
            const productMetadata = currentItemProductsMetadata.find(
                (productMetadata) => productMetadata.id === product.product_id
            )!;

            const stage = productionOrderConstants.stage[current.stage];

            if (!acc[stage]) {
                acc[stage] = {};
            }

            acc[stage][productMetadata.name] =
                (acc[stage][productMetadata.name] ?? 0) + product.quantity;
        });

        return acc;
    }, {} as Record<string, Record<string, number>>);

    const productsQuantityArray = Object.keys(productsQuantity).map((key) => {
      return {
        name: key,
        data: productsQuantity[key],
      };
    });

    // spreads since sort mutates the array in memory reference
    const productionOrdersWithMostProductsQuantity = [...productionOrders]
        .sort((po1, po2) => {
            const productionOrder1ProductsQuantity =
                po1.sale_order.products.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0
                );
            const productionOrder2ProductsQuantity =
                po2.sale_order.products.reduce(
                    (acc, curr) => acc + curr.quantity,
                    0
                );

            return (
                productionOrder2ProductsQuantity -
                productionOrder1ProductsQuantity
            );
        })
        .slice(0, 5);

    const finishedProductionOrdersProductsQuantity = productionOrders
        .filter((productionOrder) => productionOrder.stage === "completed")
        .reduce((acc, current) => {
            const productsWithQuantities = current.sale_order.products;
            const currentItemProductsMetadata = current.products_in_sale_order;

            productsWithQuantities.forEach((product) => {
                const productMetadata = currentItemProductsMetadata.find(
                    (productMetadata) =>
                        productMetadata.id === product.product_id
                )!;

                acc[productMetadata.name] =
                    (acc[productMetadata.name] ?? 0) + product.quantity;
            });

            return acc;
        }, {} as Record<string, number>);

    return (
        <div>
            <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-base font-semibold leading-7 text-gray-900">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Dashboard para insights sobre as ordens de produção
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 mt-8 grid-rows-auto items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                <BarChart
                    subtitle="Quantidade de ordens produção por estágio"
                    series={Object.entries(productionOrdersByStage).map(
                        ([key, value]) => ({
                            name: key,
                            data: [value],
                            color: getRandomHexColor(),
                        })
                    )}
                    options={{
                        xaxis: { categories: [""] },
                        chart: { stacked: false },
                        plotOptions: {
                            bar: {
                                horizontal: true,
                            },
                        },
                        stroke: {
                            width: 1,
                        },
                    }}
                />

                <BarChart
                    subtitle="Ordens de produção com mais produtos"
                    series={productionOrdersWithMostProductsQuantity.map(
                        (productionOrder) => ({
                            name: `OP-${productionOrder.code
                                .toString()
                                .padStart(5, "0")}`,
                            data: [
                                productionOrder.sale_order.products.reduce(
                                    (acc, curr) => acc + curr.quantity,
                                    0
                                ),
                            ],
                            color: getRandomHexColor(),
                        })
                    )}
                    options={{
                        xaxis: { categories: [""] },
                        chart: { stacked: false },
                        plotOptions: {
                            bar: {
                                horizontal: false,
                            },
                        },
                        stroke: {
                            width: 1,
                        },
                    }}
                />

                <PieChart
                    subtitle="Equipamentos finalizados"
                    options={{
                      labels: Object.keys(finishedProductionOrdersProductsQuantity),
                      colors: Object.keys(finishedProductionOrdersProductsQuantity).map(() => getRandomHexColor()),
                      stroke: {
                        width: 2,
                        show: true,
                      },
                      markers: {
                        colors: getRandomHexColor(),
                      }
                    }}
                    series={Object.values(finishedProductionOrdersProductsQuantity)}
                />

                <BarChart
                  subtitle="Quantidade de equipamentos por estágio"
                  series={productsQuantityArray.map((product) => ({
                    name: product.name,
                    data: [
                      Object.keys(product.data)
                        .map((key) => product.data[key])
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ],
                    color: getRandomHexColor(),
                  }))}
                  options={{
                    xaxis: {
                      categories: [""],
                    },
                    chart: { stacked: false },
                    plotOptions: {
                      bar: {
                        horizontal: false,
                      },
                    },
                    stroke: {
                      width: 1,
                    },
                  }}
                />
            </div>
        </div>
    );
}
