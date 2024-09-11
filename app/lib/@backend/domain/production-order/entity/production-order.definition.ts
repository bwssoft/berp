import { IProductionProcessStep } from "../../production-process/entity/production-process.definition"

export interface IProductionOrder {
  id: string
  priority: "high" | "medium" | "low"
  description: string
  sale_order_id: string
  created_at: Date
  stage: "in_warehouse" |
  "to_produce" |
  "producing" |
  "completed",
  production_process?: Array<IProductionOrderProcess>
}


export type IProductionOrderProcess = {
  process_uuid: string,
  steps_progress: Array<IProductionProcessStep>
}