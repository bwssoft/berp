"use client";

import {
  IClient,
  IProduct,
  IProductionOrder,
} from "@/app/lib/@backend/domain";
import { ProductionOrderPdfTemplate } from "@/app/lib/@frontend/pdf/templates/production-order-pdf-template";
import { useBuildPdf } from "@/app/lib/@frontend/pdf/use-build-pdf";
import { Button } from "@/app/lib/@frontend/ui/component";
import { PrinterIcon } from "@heroicons/react/24/outline";

type PrintProductionOrderProps = {
  productionOrder: IProductionOrder
  product: {
    id: string
    name: string
    color: string
    description: string
    created_at: Date
    process_execution?: IProduct["process_execution"]
    bom?: {
      input: {
        id: string
        name: string
      }
      quantity: number
    }[]
  }
  client: IClient
};

export function PrintProductionOrder({
  productionOrder,
  product,
  client,
}: PrintProductionOrderProps) {
  const { download } = useBuildPdf(
    <ProductionOrderPdfTemplate
      productionOrder={productionOrder}
      product={product}
      client={client}
    />
  );

  return (
    <Button
      variant="outline"
      onClick={download}
      title="Imprimir informações da ordem de produção"
      className="w-[34px] h-[34px] p-2 rounded-none mr-2"
    >
      <PrinterIcon width={16} height={16} className="text-gray-800" />
    </Button>
  );
}
