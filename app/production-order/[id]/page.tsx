"use server";

import {
  findOneProductionOrder,
  findOneSaleOrder,
} from "@/app/lib/@backend/action";

type ProductionOrderViewPageProps = {
  params: { id: string };
};

export default async function Page({ params }: ProductionOrderViewPageProps) {
  const productionOrderData = await findOneProductionOrder({ id: params.id });
  const saleOrderData = await findOneSaleOrder({
    id: productionOrderData?.sale_order_id,
  });

  return (
    <div>
      <p>Production order id: {productionOrderData?.id}</p>
      <p>Sale order id: {saleOrderData?.id}</p>
    </div>
  );
}
