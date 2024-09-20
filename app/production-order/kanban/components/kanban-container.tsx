"use client";

import { updateOneProductionOrderById } from "@/app/lib/@backend/action";
import {
  IProduct,
  IProductionOrder,
  ISaleOrder,
} from "@/app/lib/@backend/domain";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Kanban } from "./kanban";

type CustomProductionOrder = IProductionOrder & {
  sale_order: ISaleOrder;
  products_in_sale_order: IProduct[];
};
interface Props {
  productionOrders: CustomProductionOrder[];
}

const Container = (props: Props) => {
  const { productionOrders: _productionOrders } = props;
  const [productionOrders, setProductionOrders] =
    useState<CustomProductionOrder[]>(_productionOrders);

  const queryClient = useQueryClient();

  const moveCard = async (id: string, toStage: string, toIndex: number) => {
    const order = productionOrders.find((order) => order.id === id);
    if (order) {
      await updateOneProductionOrderById(
        { id: order.id },
        {
          stage: toStage as IProductionOrder["stage"],
        }
      );

      const updatedOrders = productionOrders.filter((order) => order.id !== id);
      order.stage = toStage as any;
      updatedOrders.splice(toIndex, 0, order);
      setProductionOrders(updatedOrders);

      queryClient.invalidateQueries({
        queryKey: ["findAllProductionOrdersKanban"],
      });
    }
  };

  return <Kanban productionOrders={productionOrders} moveCard={moveCard} />;
};

export const KanbanContainer = (props: Props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Container productionOrders={props.productionOrders} />
    </DndProvider>
  );
};
