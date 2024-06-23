export interface IStock {
  id?: string
  input_id: string
  balance: number
  enter: number
  exit: number
  cumulative_balance: number
  updated_at: Date
  year: number
  month: number
  day: number
  week: number
}