"use server";

import {
  findAllInput,
  findAllProduct,
  findAllTechnicalSheet,
  findOneClient,
  findOneProductionOrder,
  findOneSaleOrder,
} from "@/app/lib/@backend/action";
import {
  IClient,
  IProductionOrder,
  ISaleOrder,
} from "@/app/lib/@backend/domain";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/lib/@frontend/ui";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  AttachmentsDetails,
  ClientDetails,
  CommentsSection,
  ProductionOrderDetails,
  ProductsDetails,
  SaleOrderDetails,
} from "./components";
import { PrintProductionOrder } from "./components/print-production-order";

type ProductionOrderViewPageProps = {
  params: { id: string };
};

export default async function Page({ params }: ProductionOrderViewPageProps) {
  const productionOrderData = (await findOneProductionOrder({
    id: params.id,
  })) as IProductionOrder | null;

  const saleOrderData = (await findOneSaleOrder({
    id: productionOrderData?.sale_order_id,
  })) as ISaleOrder | null;

  const clientData = (await findOneClient({
    id: saleOrderData?.client_id,
  })) as IClient | null;

  const productsData = await findAllProduct({
    id: {
      $in: saleOrderData?.products.map(({ product_id }) => product_id) ?? [],
    },
  });

  const technicalSheetsData = await findAllTechnicalSheet({
    id: {
      $in: productsData
        ?.map((product) => product?.technical_sheet_id)
        .filter(Boolean) as unknown as string[],
    },
  });

  const inputsData = await findAllInput();

  return (
    <div className="w-full h-full relative">
      <Link href="/production-order/kanban">
        <XMarkIcon className="absolute top-1 right-1 w-6 h-6" />
      </Link>

      <div className="absolute top-0 right-10">
        <PrintProductionOrder
          productionOrder={productionOrderData}
          products={productsData}
          saleOrder={saleOrderData}
          client={clientData}
          technicalSheets={technicalSheetsData}
          inputs={inputsData}
        />
      </div>

      <Tabs defaultValue="production-order-data">
        <TabsList defaultValue="production-order-data">
          <TabsTrigger value="production-order-data">
            Detalhes da ordem de produção
          </TabsTrigger>

          <TabsTrigger value="client-data">Detalhes do cliente</TabsTrigger>

          <TabsTrigger value="sale-order-data">
            Detalhes da ordem de serviço
          </TabsTrigger>

          <TabsTrigger value="products-data">Detalhes dos produtos</TabsTrigger>

          <TabsTrigger value="attachments">Anexos</TabsTrigger>

          <TabsTrigger value="comments-data">Comentários</TabsTrigger>
        </TabsList>

        <TabsContent value="production-order-data">
          <ProductionOrderDetails
            productionOrder={productionOrderData}
            products={productsData}
            saleOrder={saleOrderData}
          />
        </TabsContent>

        <TabsContent value="client-data">
          <ClientDetails client={clientData} />
        </TabsContent>

        <TabsContent value="attachments">
          <AttachmentsDetails saleOrder={saleOrderData} />
        </TabsContent>

        <TabsContent value="sale-order-data">
          <SaleOrderDetails saleOrder={saleOrderData} />
        </TabsContent>

        <TabsContent value="products-data">
          <ProductsDetails
            products={productsData}
            technicalSheets={technicalSheetsData}
            inputs={inputsData}
          />
        </TabsContent>

        <TabsContent value="comments-data">
          <CommentsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
