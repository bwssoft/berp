"use client";

import {IEnterprise} from "@/app/lib/@backend/domain/business/entity/enterprise.entity";
import {IProduct} from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import {IProductionOrder} from "@/app/lib/@backend/domain/production/entity/production-order.definition";
import {} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Kanban } from "./kanban";

type CustomProductionOrder = IProductionOrder & {
  product: Pick<IProduct, "id" | "name" | "color">;
  enterprise: Pick<IEnterprise, "id" | "name">;
};

interface Props {
  productionOrders: CustomProductionOrder[];
}

const Container = (props: Props) => {
  const { productionOrders: _productionOrders } = props;
  const [productionOrders, setProductionOrders] =
    useState<CustomProductionOrder[]>(_productionOrders);

  useEffect(() => setProductionOrders(_productionOrders), [_productionOrders]);

  const moveCard = async (id: string, toStage: string, toIndex: number) => {
    const order = productionOrders.find((order) => order.id === id);
    if (order) {
      const updatedOrders = productionOrders.filter((order) => order.id !== id);
      order.stage = toStage as any;
      updatedOrders.splice(toIndex, 0, order);
      setProductionOrders(updatedOrders);
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
