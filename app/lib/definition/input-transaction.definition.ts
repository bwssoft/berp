export interface IInputTransaction {
  id: string
  input_id: string
  type: 'enter' | 'exit'
  quantity: number
  created_at: Date
}