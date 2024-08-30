export interface IInput {
  id: string

  name: string
  measure_unit: MeasureUnit
  color: string

  files?: string[]
  description?: string
  price?: number

  category: Category
  code: number

  created_at: Date

  manufacturer: Manufacturer[]
}

type Manufacturer = {
  code: string
  name: string
}

type Category =
  | "cap"
  | "dio"
  | "fet"
  | "swa"
  | "dcd"
  | "res"
  | "con"
  | "mod"
  | "ldo"
  | "led"
  | "sen"
  | "ind"
  | "mem"
  | "ic"
  | "ant"
  | "fus"
  | "swi"
  | "swa"
  | "trn";

type MeasureUnit = 'cm' | 'm' | 'kg' | 'g' | 'ml' | 'l' | 'un'