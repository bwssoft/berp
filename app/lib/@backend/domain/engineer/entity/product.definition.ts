import { OmieEnterpriseEnum } from "../../@shared/gateway/omie.gateway.interface";

export interface IProduct {
  id: string;
  name: string;
  category: EProductCategory
  sequence: number;
  sku: string
  price: number
  images: string[];
  files?: File[]
  description: string;
  color: string;
  created_at: Date;
  technical_sheet_id?: string[];
  omie_metadata?: OmieMetadata
}

type OmieMetadata = {
  codigo_produto: Partial<Record<OmieEnterpriseEnum, number | undefined>>;
  codigo_produto_integracao?: string
}

type File = {
  type: string
  url: string
  size: number
}

export enum EProductCategory {
  RVG = "RVG",
  CMN = "CMN"
}
