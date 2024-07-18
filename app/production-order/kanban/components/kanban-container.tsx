"use client";

import React, { useState } from "react";
import { Kanban } from "./kanban";
import { IProduct, IProductionOrder } from "@/app/@lib/backend/domain";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Props {
  productionOrders: (IProductionOrder & { _products: IProduct[] })[];
}

const Container = (props: Props) => {
  const { productionOrders: _productionOrders } = props;
  const [productionOrders, setProductionOrders] =
    useState<(IProductionOrder & { _products: IProduct[] })[]>(
      _productionOrders
    );

  const moveCard = (id: string, toStage: string, toIndex: number) => {
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
