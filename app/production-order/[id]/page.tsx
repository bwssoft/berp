"use server";

import {
  findAllProduct,
  findOneClient,
  findOneProductionOrder,
  findOneSaleOrder,
} from "@/app/lib/@backend/action";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/lib/@frontend/ui";
import {
  ClientDetails,
  CommentsSection,
  ProductionOrderDetails,
  ProductsDetails,
  SaleOrderDetails,
} from "./components";

type ProductionOrderViewPageProps = {
  params: { id: string };
};

export default async function Page({ params }: ProductionOrderViewPageProps) {
  const productionOrderData = await findOneProductionOrder({ id: params.id });

  const saleOrderData = await findOneSaleOrder({
    id: productionOrderData?.sale_order_id,
  });

  const clientData = await findOneClient({ id: saleOrderData?.client_id });

  const productsData = await findAllProduct({
    id: {
      $in: saleOrderData?.products.map(({ product_id }) => product_id),
    },
  });

  return (
    <div className="w-full h-full">
      <Tabs>
        <TabsList defaultValue="production-order-data">
          <TabsTrigger value="production-order-data">
            Detalhes da ordem de produção
          </TabsTrigger>

          <TabsTrigger value="client-data">Detalhes do cliente</TabsTrigger>

          <TabsTrigger value="sale-order-data">
            Detalhes da ordem de serviço
          </TabsTrigger>

          <TabsTrigger value="products-data">Detalhes dos produtos</TabsTrigger>

          <TabsTrigger value="comments-data">Comentários</TabsTrigger>
        </TabsList>

        <TabsContent value="production-order-data">
          <ProductionOrderDetails />
        </TabsContent>

        <TabsContent value="client-data">
          <ClientDetails />
        </TabsContent>

        <TabsContent value="sale-order-data">
          <SaleOrderDetails />
        </TabsContent>

        <TabsContent value="products-data">
          <ProductsDetails />
        </TabsContent>

        <TabsContent value="comments-data">
          <CommentsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
