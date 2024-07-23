export interface IOpportunity {
  id?: string
  name: string
  client_id: string
  initial_supply_date: Date
  expected_closure_date: Date
  value: number
  products: { product_id: string, quantity: number }[]
  type: "existing_business" |
  "new_business"
  sales_stage: "initial_contact" |
  "under_review" |
  "proposal_sent" |
  "in_negotiation" |
  "sale_won" |
  "sale_lost" |
  "stopped"
  recurrence_type: "monthly" |
  "annual" |
  "one_time_sale"
  probability: number
  description: string
  created_at: Date
};
