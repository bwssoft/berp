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
import { PrintProductionOrder } from "./components/print-production-order";

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

  if (!clientData) return <div>
    <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
      <div>
        <h1 className="text-base font-semibold leading-7 text-gray-900">
          Cliente não encontrado
        </h1>
      </div>
    </div>
  </div>

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 right-0 flex gap-2 items-center">
        <PrintProductionOrder
          productionOrder={productionOrderData}
          product={productionOrderData.product}
          client={clientData}
        />
        <Link href="/production/production-order/kanban" title="Fechar o modal de Ordem de Produção" >
          <XMarkIcon height={22} width={22} />
        </Link>
      </div>

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
