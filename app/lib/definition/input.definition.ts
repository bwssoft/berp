export interface IInput {
  id: string
  name: string
  measure_unit: 'cm' | 'm' | 'kg' | 'g' | 'ml' | 'l'
  amount: number
}