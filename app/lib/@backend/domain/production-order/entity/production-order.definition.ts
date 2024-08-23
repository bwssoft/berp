export interface IProductionOrder {
  id: string
  priority: "high" | "medium" | "low"
  description: string
  sale_order_id: string
  created_at: Date
  stage: "in_warehouse" |
  "to_produce" |
  "producing" |
  "quality" |
  "checked" |
  "completed" |
  "stored"
}

