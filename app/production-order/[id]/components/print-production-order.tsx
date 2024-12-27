"use client";

import {
  IClient,
  IInput,
  IProduct,
  IProductionOrder,
  IFinancialOrder,
  ITechnicalSheet,
  IProductionOrderLegacy,
} from "@/app/lib/@backend/domain";
import { ProductionOrderPdfTemplate } from "@/app/lib/@frontend/pdf/templates/production-order-pdf-template";
import { useBuildPdf } from "@/app/lib/@frontend/pdf/use-build-pdf";
import { Button } from "@/app/lib/@frontend/ui/component";
import { PrinterIcon } from "@heroicons/react/24/outline";

type PrintProductionOrderProps = {
  productionOrder: IProductionOrderLegacy | null;
  products: IProduct[];
  technicalSheets: ITechnicalSheet[];
  saleOrder: IFinancialOrder | null;
  client: IClient | null;
  inputs: IInput[];
};

export function PrintProductionOrder({
  productionOrder,
  products,
  saleOrder,
  client,
  technicalSheets,
  inputs,
}: PrintProductionOrderProps) {
  const { download } = useBuildPdf(
    <ProductionOrderPdfTemplate
      productionOrder={productionOrder}
      products={products}
      saleOrder={saleOrder}
      client={client}
      technicalSheets={technicalSheets}
      inputs={inputs}
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
