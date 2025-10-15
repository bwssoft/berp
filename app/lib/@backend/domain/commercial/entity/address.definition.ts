export interface IAddress {
  id?: string | undefined;
  accountId?: string;
  street?: string | undefined;
  district?: string | undefined;
  city?: string | undefined;
  zip_code?: string | undefined;
  state?: string | undefined;
  number?: string | undefined;
  complement?: string | undefined;
  reference_point?: string | undefined;
  type?: ("Comercial" | "Entrega" | "Faturamento" | "Residencial" | "Fiscal")[];
  default_address?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export default IAddress;
