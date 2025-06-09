import { IAddress } from "./address.definition";
import { IContact } from "./contact.definition";
import { ISector } from "./sector.definition";

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
    setor?: string[];
    address?: string[];
    contacts?: IContact[];
    economic_group_holding?: EconomicGroup;
    economic_group_controlled?: EconomicGroup[];
    created_at?: Date;
    updated_at?: Date;
    billing_status?: "Ativo" | "Inativo";
    billing_situation?:
        | "Adimplente"
        | "Inadimplente"
        | "Inadimplente/Bloqueado";
    last_billing_date?: Date;
}

export interface EconomicGroup {
    name: string;
    taxId: string;
}
