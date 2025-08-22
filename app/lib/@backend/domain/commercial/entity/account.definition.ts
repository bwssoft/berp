import { IContact } from "./contact.definition";

export interface IAccount {
  id?: string | undefined;
  document: { value: string; type: "cpf" | "cnpj" };
  name?: string;
  rg?: string;
  social_name?: string;
  fantasy_name?: string;
  state_registration?: string;
  municipal_registration?: string;
  status?: string;
  situationIE?: { id: string; status: boolean; text: string };
  typeIE?: string;
  setor?: string[];
  address?: string[];
  economicGroupId?: string;
  contacts?: IContact[];
  created_at?: Date;
  updated_at?: Date;
  billing_status?: "Ativo" | "Inativo";
  billing_situation?: "Adimplente" | "Inadimplente" | "Inadimplente/Bloqueado";
  last_billing_date?: Date;
}
