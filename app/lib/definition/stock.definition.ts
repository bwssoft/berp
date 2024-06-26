export interface IStock {
  id?: string
  input_id: string
  available_balance: number
  enter: number
  exit: number
}

export interface ITemporalStock {
  id?: string
  input_id: string
  available_balance: number
  cumulative_balance: number
  enter: number
  exit: number
  date: {
    day: number
    month: number
    year: number
  }
}