"use client";

import {
  findOneProductionOrder,
  updateOneProductionOrderById,
} from "@/app/lib/@backend/action/production/production-order.action";
import {IProduct} from "@/app/lib/@backend/domain/commercial/entity/product.definition";
import {IProductionOrder, EProductionOrderStage} from "@/app/lib/@backend/domain/production/entity/production-order.definition";
import {IEnterprise} from "@/app/lib/@backend/domain/business/entity/enterprise.entity";
import {} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { productionOrderConstants } from "@/app/lib/constant";
import { formatDate } from "@/app/lib/util";
import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "CARD";

type CustomProductionOrder = IProductionOrder & {
  product: Pick<IProduct, "id" | "name" | "color">;
  enterprise: Pick<IEnterprise, "id" | "name">;
};

interface CardProps {
  order: CustomProductionOrder;
  index: number;
  moveCard: (id: string, toStage: string, toIndex: number) => void;
}

const stageColor = {
  in_approval: "bg-blue-200",
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
      className="flex flex-col gap-2 w-full p-2 rounded shadow-sm border-gray-100 border-2 relative text-xs"
    >
      <div className="w-full flex flex-col justify-between">
        <div className="w-full flex justify-between items-center">
          <p>OP-{order.code.toString().padStart(5, "0")}</p>
          <p className="text-gray-400">
            {order.enterprise.name.short.toUpperCase()}
          </p>
        </div>
      </div>

      {/* TODO: Apresentar de qual o pedido da omie relacionado a essa OP */}
      {/* <div className="w-full flex flex-col-reverse gap-2 justify-between">
        <p>
          No. pedido OMIE:{" "}
          <span>
            {order.sale_order.omie_webhook_metadata.order_number}
          </span>
        </p> 
      </div>*/}

      <div className="flex flex-row items-center">
        <div
          style={{ backgroundColor: order.product.color }}
          className={`rounded-full w-4 h-4 mr-2`}
        ></div>
        <p>
          <span>{order.total_quantity} </span>-{" "}
          {order.product.name.toUpperCase()}
        </p>
      </div>

      {/* TODO: Apresentar o progresso do production_process (production_execution) */}
      {/* {order.production_process?.[0].process_uuid && (
        <Accordion type="multiple" className="flex flex-col gap-1 mt-4">
          <AccordionItem value={order.id}>
            <AccordionTrigger
              value={order.id}
            >
              Progresso das etapas
            </AccordionTrigger>

            <AccordionContent>
              <ProductionOrderStepsUpdateForm productionOrder={order} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )} */}

      <div className="w-full flex items-center justify-between">
        <p className="text-gray-500">
          {formatDate(new Date(order.created_at), { includeHours: true })}
        </p>
        <Link
          href={`/production/production-order/${order.id}`}
          className="bg-white w-max p-1 rounded border border-gray-300 shadow-sm hover:bg-gray-200"
          title="Ver detalhes da ordem de produção"
        >
          <ArrowUpRightIcon width={16} height={16} />
        </Link>
      </div>
    </div>
  );
};

interface ColumnProps {
  stage: string;
  title: string;
  orders: CustomProductionOrder[];
  moveCard: (id: string, toStage: string, toIndex: number) => void;
}

const Column: React.FC<ColumnProps> = ({ stage, title, orders, moveCard }) => {
  const [, ref] = useDrop({
    accept: ItemType,
    drop: async (item: { id: string }) => {
      const currentOrder = await findOneProductionOrder({
        id: item.id,
      });

      {
        /* TODO: Refazer logica para atualizar o 'stage' de uma OP */
      }

      // const productionOrderHaveSteps =
      //   currentOrder?.production_process !== undefined;

      // const areAllProductionOrderStepsChecked =
      //   currentOrder?.production_process?.[0].steps_progress.every(
      //     ({ checked }) => checked === true
      //   );

      // if (
      //   productionOrderHaveSteps &&
      //   stage === "completed" &&
      //   !areAllProductionOrderStepsChecked
      // ) {
      //   toast({
      //     title: "Erro!",
      //     description: "É necessário finalizar todas as etapas",
      //     variant: "error",
      //   });
      //   moveCard(item.id, currentOrder.stage, orders.length);
      //   return;
      // }

      if (currentOrder) {
        await updateOneProductionOrderById(
          { id: currentOrder.id },
          {
            stage: stage as EProductionOrderStage,
          }
        );
      }

      {
        /* TODO: Refazer logica para atualizar o status do pedido da omie relacionado */
      }

      // if (currentOrder && stage === "completed") {
      //   await updateSaleOrderStatus({
      //     enterprise: currentOrder!.sale_order.omie_webhook_metadata.enterprise,
      //     saleOrderId: currentOrder!.sale_order.omie_webhook_metadata.order_id,
      //     statusId: "50",
      //   });
      // }

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
            } text-sm w-max px-1 rounded mr-2 text-gray-600 font-bold`}
          >
            {title.toUpperCase()}
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

export const Kanban: React.FC<KanbanProps> = ({
  moveCard,
  productionOrders,
}) => {
  const stages = [
    { id: "in_approval", title: "Em aprovação" },
    { id: "in_warehouse", title: "No Almoxarifado" },
    { id: "to_produce", title: "Para Produzir" },
    { id: "producing", title: "Produzindo" },
    { id: "completed", title: "Finalizada" },
  ];

  const getOrdersByStage = (stage: string) =>
    productionOrders.filter((order) => order.stage === stage) ?? [];

  return (
    <div className="h-screen mt-10 w-full grid md:grid-cols-5 sm:grid-cols-2 gap-5">
      {stages.map((stage) => (
        <Column
          key={stage.id}
          stage={stage.id}
          title={stage.title}
          orders={getOrdersByStage(stage.id)}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
};
