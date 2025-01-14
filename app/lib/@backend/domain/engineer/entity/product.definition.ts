import { OmieEnterpriseEnum } from "../../@shared/gateway/omie.gateway.interface";

export interface IProduct {
  id: string
  name: string
  category: string
  description: string
  color: string
  price: number
  files: File[]
  code: number
  bom?: Bom[]
  process_execution?: ProcessExecution[]
  omie_metadata?: OmieMetadata
  created_at: Date
}

type ProcessExecution = {
  id: string
  step: string
}

type Bom = {
  input_id: string;
  quantity: number
}

type File = {
  id: string
  key: string
  name: string
  size: number
  type: string
}

type OmieMetadata = {
  codigo_produto: Partial<Record<OmieEnterpriseEnum, number | undefined>>;
  codigo_produto_integracao?: string
}

export enum EProductCategory {
  RVG = "RVG",
  CMN = "CMN"
}
