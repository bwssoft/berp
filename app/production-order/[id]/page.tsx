"use server";

import {
  findOneClient,
  findOneProductionOrder,
} from "@/app/lib/@backend/action";
import {
  IClient,
} from "@/app/lib/@backend/domain";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/lib/@frontend/ui/component";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  ClientDetails,
  ProductionOrderDetails,
  ProductsDetails,
} from "./components";

type ProductionOrderViewPageProps = {
  params: { id: string };
};

export default async function Page({ params }: ProductionOrderViewPageProps) {
  const productionOrderData = await findOneProductionOrder({
    id: params.id,
  })

  if (!productionOrderData) return <div>
    <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
      <div>
        <h1 className="text-base font-semibold leading-7 text-gray-900">
          OP não encontrada
        </h1>
      </div>
    </div>
  </div>

  const clientData = (await findOneClient({
    id: productionOrderData?.client_id,
  })) as IClient | null;

  return (
    <div className="w-full h-full relative">
      <Link href="/production-order/kanban">
        <XMarkIcon className="absolute top-1 right-1 w-6 h-6" />
      </Link>
      {/*TODO: Refazer a exportação em pdf de uma op*/}
      {/* <div className="absolute top-0 right-10">
        <PrintProductionOrder
          productionOrder={productionOrderData}
          products={productsData}
          saleOrder={saleOrderData}
          client={clientData}
          technicalSheets={technicalSheetsData}
          inputs={inputsData}
        />
      </div> */}

      <Tabs defaultValue="production-order-data">
        <TabsList defaultValue="production-order-data">
          <TabsTrigger value="production-order-data">
            Detalhes da ordem de produção
          </TabsTrigger>

          <TabsTrigger value="client-data">Detalhes do cliente</TabsTrigger>

          <TabsTrigger value="products-data">Detalhes do produto</TabsTrigger>
          <TabsTrigger value="process-execution">Execução</TabsTrigger>
        </TabsList>

        <TabsContent value="production-order-data">
          <ProductionOrderDetails
            productionOrder={productionOrderData}
          />
        </TabsContent>

        <TabsContent value="client-data">
          <ClientDetails client={clientData} />
        </TabsContent>

        <TabsContent value="products-data">
          <ProductsDetails
            product={productionOrderData.product}
          />
        </TabsContent>

        <TabsContent value="process-execution">
          <div>execution</div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
