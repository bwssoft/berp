import { OmieEnterpriseEnum } from "../../@shared/gateway/omie.gateway.interface";

export interface IProduct {
  id: string;
  seq: number;
  name: string;
  category: Product.Category;
  color: string;
  active: boolean;
  created_at: Date;

  spec?: Record<string, string>;
  files?: string[];
  description?: string;
  price?: number;

  updated_at?: Date;
  omie_metadata?: Product.OmieMetadata;
  technology_id?: string;
}

export namespace Product {
  export type Category = {
    id: string;
    code: string;
  };

  export type OmieMetadata = {
    codigo_produto: Partial<Record<OmieEnterpriseEnum, number | undefined>>;
    codigo_produto_integracao?: string;
  };
}
