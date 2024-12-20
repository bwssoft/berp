import { IProductionProcessStep } from "../../production-process/entity/production-process.definition";

export interface IProductionOrder {
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
  IProductionOrder["stage"],
  string
> = {
  in_warehouse: "No almoxarifado",
  to_produce: "Para Produzir",
  producing: "Produzindo",
  completed: "Finalizada",
};

export const productionOrderPriorityMapping: Record<
  IProductionOrder["priority"],
  string
> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};
