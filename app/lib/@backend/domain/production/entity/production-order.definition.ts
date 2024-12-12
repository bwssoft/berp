export interface IProductionOrder {
  id: string
  client_id: string
  proposal_id: string | undefined
  financial_order_id: string | undefined
  line_items: LineItem[]
  product_id: string
  total_quantity: number
  description: string
  created_at: Date
  production_process_id: string
  production_execution_id: string
  //legacy
  active: boolean;
  priority: "high" | "medium" | "low";
  sale_order_id: string;
  stage: "in_warehouse" | "to_produce" | "producing" | "completed";
  production_process?: Array<IProductionOrderProcess>;
  code: number;

}

interface LineItem {
  configuration_profile_id: string
  parcial_quantity: number
}


import { IProductionProcessStep } from "./production-process.definition";

interface IProductionOrderLegacy {
  id: string;
  active: boolean;
  priority: "high" | "medium" | "low";
  description: string;
  sale_order_id: string;
  created_at: Date;
  stage: "in_warehouse" | "to_produce" | "producing" | "completed";
  production_process?: Array<IProductionOrderProcess>;
  code: number;
}

export type IProductionOrderStep = IProductionProcessStep & {
  checked: boolean;
};

export type IProductionOrderProcess = {
  process_uuid: string;
  steps_progress: Array<IProductionOrderStep>;
};

export const productionOrderStageMapping: Record<
  IProductionOrderLegacy["stage"],
  string
> = {
  in_warehouse: "No almoxarifado",
  to_produce: "Para Produzir",
  producing: "Produzindo",
  completed: "Finalizada",
};

export const productionOrderPriorityMapping: Record<
  IProductionOrderLegacy["priority"],
  string
> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};
