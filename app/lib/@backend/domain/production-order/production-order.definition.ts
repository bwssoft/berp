export interface IProductionOrder {
  id?: string
  priority: "high" | "medium" | "low"
  description: string
  files?: any[]
  products: { product_id: string, quantity: number }[]
  created_at: Date
  stage: "to_produce" |
  "producing" |
  "quality" |
  "checked" |
  "completed" |
  "stored"
}

