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
  'mdm' |
  'ids' |
  'cis' |
  'com' |
  'pcb' |
  'bat' |
  'cht' |
  'cas' |
  'ant' |
  'dis'

type MeasureUnit = 'cm' | 'm' | 'kg' | 'g' | 'ml' | 'l' | 'un'