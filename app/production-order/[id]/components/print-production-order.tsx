"use client";

import {
  IClient,
  IProduct,
  IProductionOrder,
  ISaleOrder,
} from "@/app/lib/@backend/domain";
import { ProductionOrderPdfTemplate } from "@/app/lib/@frontend/pdf/templates/production-order-pdf-template";
import { useBuildPdf } from "@/app/lib/@frontend/pdf/use-build-pdf";
import { Button } from "@/app/lib/@frontend/ui";
import { PrinterIcon } from "@heroicons/react/24/outline";

type PrintProductionOrderProps = {
  productionOrder: IProductionOrder | null;
  products: IProduct[];
  saleOrder: ISaleOrder | null;
  client: IClient | null;
};

export function PrintProductionOrder({
  productionOrder,
  products,
  saleOrder,
  client,
}: PrintProductionOrderProps) {
  const { download } = useBuildPdf(
    <ProductionOrderPdfTemplate
      productionOrder={productionOrder}
      products={products}
      saleOrder={saleOrder}
      client={client}
    />
  );

  return (
    <Button
      variant="outline"
      onClick={download}
      title="Imprimir informações"
      className="w-[34px] h-[34px] p-2 rounded-none mr-2"
    >
      <PrinterIcon width={16} height={16} className="text-gray-800" />
    </Button>
  );
}
