"use client";
import { findAllProductionOrderWithProduct } from "@/app/lib/@backend/action";
import {
  IProduct,
  IProductionOrder,
  ISaleOrder,
} from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { Button, ProductionOrderStepsUpdateForm } from "@/app/lib/@frontend/ui";
import { productionOrderConstants } from "@/app/lib/constant";
import { formatDate } from "@/app/lib/util";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "CARD";

type CustomProductionOrder = IProductionOrder & {
  sale_order: ISaleOrder;
  products_in_sale_order: IProduct[];
};

interface CardProps {
  order: CustomProductionOrder;
  index: number;
  moveCard: (id: string, toStage: string, toIndex: number) => void;
}

const stageColor = {
  in_warehouse: "bg-purple-200",
  to_produce: "bg-slate-200",
  producing: "bg-yellow-200",
  completed: "bg-green-200",
};

const Card: React.FC<CardProps> = ({ order, index, moveCard }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { id: order.id, index, stage: order.stage },
  });

  const { push } = useRouter();

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: { id: string; index: number; stage: string }) {
      if (item.id !== order.id) {
        moveCard(item.id, order.stage, index);
        item.index = index;
        item.stage = order.stage;
      }
    },
  });

  return (
    <div
      ref={(node) => ref(drop(node)) as any}
      className="w-full p-2 rounded shadow-sm border-gray-100 border-2 relative"
    >
      <div className="w-full flex justify-between">
        <p className="text-sm mb-3 text-gray-500 font-semibold">
          OP-{order.id?.split("-")[0].toUpperCase()}
        </p>
        <p className="text-sm mb-3 text-gray-700 font-semibold">
          {formatDate(new Date(order.created_at), { includeHours: true })}
        </p>
      </div>

      <p
        className={`${
          stageColor[order.stage]
        } text-xs w-max p-1 rounded mr-2 text-gray-700  font-bold`}
      >
        {productionOrderConstants.stage[order.stage]}
      </p>

      {order.products_in_sale_order.map((p) => (
        <div key={p.id} className="flex flex-row items-center mt-2">
          <div
            style={{ backgroundColor: p.color }}
            className={`rounded-full w-4 h-4 mr-2`}
          ></div>
          <p className="text-xs text-gray-500">
            <span className="text-xs text-gray-700">
              {
                order.sale_order.products.find((el) => el.product_id === p.id)
                  ?.quantity
              }{" "}
            </span>
            - {p.name}
          </p>
        </div>
      ))}

      {order.production_process?.[0].process_uuid && (
        <div className="flex flex-col gap-1 mt-4">
          <p className="text-sm font-semibold text-gray-800">
            Progresso das etapas
          </p>
          <ProductionOrderStepsUpdateForm productionOrder={order} />
        </div>
      )}

      <Button
        onClick={() => {
          push(`/production-order/${order.id}`);
        }}
        variant="ghost"
        className="absolute bottom-1 right-2 p-2"
      >
        <ArrowUpRightIcon width={16} height={16} className="text-gray-800" />
      </Button>
    </div>
  );
};

interface ColumnProps {
  stage: string;
  title: string;
  allProductionOrders: IProductionOrder[];
  orders: CustomProductionOrder[];
  moveCard: (id: string, toStage: string, toIndex: number) => void;
}

const Column: React.FC<ColumnProps> = ({
  stage,
  title,
  orders,
  allProductionOrders,
  moveCard,
}) => {
  const [, ref] = useDrop({
    accept: ItemType,
    drop: (item: { id: string }) => {
      const currentOrder = allProductionOrders.find(
        (order) => order.id === item.id
      );

      const areAllProductionOrderStepsChecked =
        currentOrder?.production_process?.[0].steps_progress.every(
          ({ checked }) => checked === true
        );

      if (stage === "completed" && !areAllProductionOrderStepsChecked) {
        toast({
          title: "Erro!",
          description: "É necessário finalizar todas as etapas",
          variant: "error",
        });
        return;
      }

      moveCard(item.id, stage, orders.length);
    },
  });

  return (
    <div ref={ref as any} className="bg-white p-2 border-x-2 border-x-gray-100">
      <div className="flex flex-row justify-between items-center mb-2 mx-1">
        <div className="flex items-center">
          <h2
            className={`${
              stageColor[stage as keyof typeof stageColor]
            } text-sm w-max px-1 rounded mr-2 text-gray-700 font-bold`}
          >
            {title}
          </h2>
          <p className="text-gray-400 text-sm">{orders.length}</p>
        </div>
      </div>
      <div className="grid grid-rows-2 gap-2">
        {orders.map((order, index) => (
          <Card
            key={order.id}
            order={order}
            index={index}
            moveCard={moveCard}
          />
        ))}
      </div>
    </div>
  );
};

interface KanbanProps {
  productionOrders: CustomProductionOrder[];
  moveCard: (id: string, toStage: string, toIndex: number) => void;
}

export const Kanban: React.FC<KanbanProps> = ({ moveCard }) => {
  const findAllProductionOrders = useQuery({
    queryKey: ["findAllProductionOrdersKanban"],
    queryFn: () => findAllProductionOrderWithProduct(),
  });

  const stages = [
    { id: "in_warehouse", title: "No Almoxarifado" },
    { id: "to_produce", title: "Para Produzir" },
    { id: "producing", title: "Produzindo" },
    { id: "completed", title: "Finalizada" },
  ];

  const getOrdersByStage = (stage: string) =>
    findAllProductionOrders.data?.filter((order) => order.stage === stage) ??
    [];

  return (
    <div className="h-screen mt-10 w-full grid md:grid-cols-4 sm:grid-cols-2 gap-5">
      {stages.map((stage) => (
        <Column
          key={stage.id}
          allProductionOrders={findAllProductionOrders.data ?? []}
          stage={stage.id}
          title={stage.title}
          orders={getOrdersByStage(stage.id)}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
};
