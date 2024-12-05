export interface IProductTemporalStock {
  id?: string
  product_id: string
  balance: number
  cumulative_balance: number
  enter: number
  exit: number
  date: {
    day: number
    month: number
    year: number
  }
}