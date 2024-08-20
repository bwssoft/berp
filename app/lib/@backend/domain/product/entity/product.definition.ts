import { OmieEnterprise } from "../../client"

export interface IProduct {
  id: string
  name: string
  files?: string[]
  description: string
  color: string
  inputs: { input_id: string, quantity: number }[]
  created_at: Date
  omie_code_metadata?: {
    enterprise: keyof OmieEnterprise
    code: string
  }[]
}

