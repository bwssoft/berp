"use client";
// //  Inspiration https://s3-ap-southeast-2.amazonaws.com/focusbooster.cdn/Landing+pages/kanban-and-focusbooster/kanban-board-notion.png

// import { IProductionOrder } from "@/app/lib/@backend/domain";

// interface Props {
//   productionOrders: IProductionOrder[];
// }
// export function Kanban(props: Props) {
//   const { productionOrders } = props;

//   const to_produce = productionOrders.filter((p) => p.stage === "to_produce");
//   const producing = productionOrders.filter((p) => p.stage === "producing");
//   const quality = productionOrders.filter((p) => p.stage === "quality");
//   const checked = productionOrders.filter((p) => p.stage === "checked");
//   const completed = productionOrders.filter((p) => p.stage === "completed");
//   const stored = productionOrders.filter((p) => p.stage === "stored");
//   return (
//     <div className="h-screen mt-10 w-full">
//       <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-5">
//         {/* <!-- To-do --> */}
//         <div className="bg-white p-2 border-x-2 border-x-gray-100">
//           {/* <!-- board category header --> */}
//           <div className="flex flex-row justify-between items-center mb-2 mx-1">
//             <div className="flex items-center">
//               <h2 className="bg-slate-200 text-sm w-max px-1 rounded mr-2 text-gray-700">
//                 Para Produzir
//               </h2>
//               <p className="text-gray-400 text-sm">{to_produce.length}</p>
//             </div>
//           </div>
//           {/* <!-- board card --> */}
//           <div className="grid grid-rows-2 gap-2">
//             {to_produce.map((p) => (
//               <div
//                 key={p.id}
//                 className="w-full p-2 rounded shadow-sm border-gray-100 border-2"
//               >
//                 <h3 className="text-sm mb-3 text-gray-700">Social media</h3>
//                 <p className="bg-slate-200 text-xs w-max p-1 rounded mr-2 text-gray-700">
//                   Para Produzir
//                 </p>
//                 <div className="flex flex-row items-center mt-2">
//                   <div className="bg-gray-300 rounded-full w-4 h-4 mr-2"></div>
//                   <a href="#" className="text-xs text-gray-500">
//                     Sophie Worso
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* <!-- WIP Kanban --> */}
//         <div className="bg-white p-2 border-x-2 border-x-gray-100">
//           {/* <!-- board category header --> */}
//           <div className="flex flex-row justify-between items-center mb-2 mx-1">
//             <div className="flex items-center">
//               <h2 className="bg-yellow-200 text-sm w-max px-1 rounded mr-2 text-gray-700">
//                 Produzindo
//               </h2>
//               <p className="text-gray-400 text-sm">{producing.length}</p>
//             </div>
//           </div>
//           {/* <!-- board card --> */}
//           <div className="grid grid-rows-2 gap-2">
//             {producing.map((p) => (
//               <div
//                 key={p.id}
//                 className="w-full p-2 rounded shadow-sm border-gray-100 border-2"
//               >
//                 <h3 className="text-sm mb-3 text-gray-700">Blog post live</h3>
//                 <p className="bg-yellow-200 text-xs w-max p-1 rounded mr-2 text-gray-700">
//                   Produzindo
//                 </p>
//                 <div className="flex flex-row items-center mt-2">
//                   <div className="bg-gray-300 rounded-full w-4 h-4 mr-2"></div>
//                   <a href="#" className="text-xs text-gray-500">
//                     Sophie Worso
//                   </a>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">Jun 21, 2019</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* <!-- Complete Kanban --> */}
//         <div className="bg-white p-2 border-x-2 border-x-gray-100">
//           {/* <!-- board category header --> */}
//           <div className="flex flex-row justify-between items-center mb-2 mx-1">
//             <div className="flex items-center">
//               <h2 className="bg-orange-200 text-sm w-max px-1 rounded mr-2 text-gray-700">
//                 Qualidade
//               </h2>
//               <p className="text-gray-400 text-sm">{quality.length}</p>
//             </div>
//           </div>
//           {/* <!-- board card --> */}
//           <div className="grid grid-rows-2 gap-2">
//             {quality.map((p) => (
//               <div
//                 key={p.id}
//                 className="w-full p-2 rounded shadow-sm border-gray-100 border-2"
//               >
//                 <h3 className="text-sm mb-3 text-gray-700">
//                   Morning emails and to-do list
//                 </h3>
//                 <p className="bg-orange-200 text-xs w-max p-1 rounded mr-2 text-gray-700">
//                   Qualidade
//                 </p>
//                 <div className="flex flex-row items-center mt-2">
//                   <div className="bg-gray-300 rounded-full w-4 h-4 mr-2"></div>
//                   <a href="#" className="text-xs text-gray-500">
//                     Sophie Worso
//                   </a>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">Jun 21, 2019</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* <!-- Checked --> */}
//         <div className="bg-white p-2 border-x-2 border-x-gray-100">
//           {/* <!-- board category header --> */}
//           <div className="flex flex-row justify-between items-center mb-2 mx-1">
//             <div className="flex items-center">
//               <h2 className="bg-purple-200 text-sm w-max px-1 rounded mr-2 text-gray-700">
//                 Checagem
//               </h2>
//               <p className="text-gray-400 text-sm">{checked.length}</p>
//             </div>
//           </div>
//           {/* <!-- board card --> */}
//           <div className="grid grid-rows-2 gap-2">
//             {checked.map((p) => (
//               <div
//                 key={p.id}
//                 className="w-full p-2 rounded shadow-sm border-gray-100 border-2"
//               >
//                 <h3 className="text-sm mb-3 text-gray-700">Social media</h3>
//                 <p className="bg-purple-200 text-xs w-max p-1 rounded mr-2 text-gray-700">
//                   Checagem
//                 </p>
//                 <div className="flex flex-row items-center mt-2">
//                   <div className="bg-gray-300 rounded-full w-4 h-4 mr-2"></div>
//                   <a href="#" className="text-xs text-gray-500">
//                     Sophie Worso
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* <!-- Complete --> */}
//         <div className="bg-white p-2 border-x-2 border-x-gray-100">
//           {/* <!-- board category header --> */}
//           <div className="flex flex-row justify-between items-center mb-2 mx-1">
//             <div className="flex items-center">
//               <h2 className="bg-green-200 text-sm w-max px-1 rounded mr-2 text-gray-700">
//                 Finalizada
//               </h2>
//               <p className="text-gray-400 text-sm">{completed.length}</p>
//             </div>
//           </div>
//           {/* <!-- board card --> */}
//           <div className="grid grid-rows-2 gap-2">
//             {completed.map((p) => (
//               <div
//                 key={p.id}
//                 className="w-full p-2 rounded shadow-sm border-gray-100 border-2"
//               >
//                 <h3 className="text-sm mb-3 text-gray-700">Social media</h3>
//                 <p className="bg-green-200 text-xs w-max p-1 rounded mr-2 text-gray-700">
//                   Finalizada
//                 </p>
//                 <div className="flex flex-row items-center mt-2">
//                   <div className="bg-gray-300 rounded-full w-4 h-4 mr-2"></div>
//                   <a href="#" className="text-xs text-gray-500">
//                     Sophie Worso
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  IProduct,
  IProductionOrder,
  ISaleOrder,
} from "@/app/lib/@backend/domain";
import { productionOrderConstants } from "@/app/lib/constant";

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
      className="w-full p-2 rounded shadow-sm border-gray-100 border-2"
    >
      <h3 className="text-sm mb-3 text-gray-700">{order.id?.slice(0, 5)}</h3>
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
          <a href="#" className="text-xs text-gray-500">
            <span className="text-xs text-gray-700">
              {
                order.sale_order.products.find((el) => el.product_id === p.id)
                  ?.quantity
              }{" "}
            </span>
            - {p.name}
          </a>
        </div>
      ))}
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
    drop: (item: { id: string }) => moveCard(item.id, stage, orders.length),
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

export const Kanban: React.FC<KanbanProps> = ({
  productionOrders,
  moveCard,
}) => {
  const stages = [
    { id: "in_warehouse", title: "No Almoxarifado" },
    { id: "to_produce", title: "Para Produzir" },
    { id: "producing", title: "Produzindo" },
    { id: "completed", title: "Finalizada" },
  ];

  const getOrdersByStage = (stage: string) =>
    productionOrders.filter((order) => order.stage === stage);

  return (
    <div className="h-screen mt-10 w-full grid md:grid-cols-4 sm:grid-cols-2 gap-5">
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
