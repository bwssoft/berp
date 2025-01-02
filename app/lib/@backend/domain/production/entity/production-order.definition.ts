export interface IProductionOrder {
  id: string
  client_id: string
  enterprise_id: string
  proposal_id?: string
  financial_order_id?: string
  description?: string
  line_items: LineItem[]
  product_id: string
  total_quantity: number
  created_at: Date
  code: number
  stage: EProductionOrderStage
  priority: EProductionOrderPriority
  process_execution?: {
    [user_id: string]: {
      process_execution_id: string
      start_check: boolean
      start_time: Date
      end_check: boolean
      end_time: Date
    }[]
  }
}

interface LineItem {
  configuration_profile_id?: string
  parcial_quantity: number
}

export enum EProductionOrderPriority {
  high = "high",
  medium = "medium",
  low = "low",
}

export enum EProductionOrderStage {
  in_approval = "in_approval",
  in_warehouse = "in_warehouse",
  to_produce = "to_produce",
  producing = "producing",
  completed = "completed",
}


import { IProductionProcessStep } from "./production-process.definition";

export interface IProductionOrderLegacy {
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