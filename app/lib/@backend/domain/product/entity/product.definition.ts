import { OmieEnterprise } from "../../client";

export interface IProduct {
  id: string;
  name: string;
  files?: string[];
  description: string;
  color: string;
  created_at: Date;
  technical_sheet_id?: string[];
  omie_code_metadata?: Record<keyof typeof OmieEnterprise, string>;
}
