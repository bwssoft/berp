export interface IProduct {
  id?: string
  name: string
  files?: string[]
  description: string
  inputs: { input_id: string, quantity: number }[]
  created_at: Date
}

