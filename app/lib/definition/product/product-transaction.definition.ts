export interface IProductTransaction {
  id: string
  product_id: string
  type: 'enter' | 'exit'
  quantity: number
  created_at: Date
  files?: string[]
}