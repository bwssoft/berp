export interface IInput {
  id: string
  name: string
  description?: string
  measure_unit: 'cm' | 'm' | 'kg' | 'g' | 'ml' | 'l' | 'un'
  files?: string[]
  created_at: Date
  color: string
  price: number
}