export interface IContact {
  id: string;
  contractEnabled: boolean;
  name: string;
  positionOrRelation: string;
  department?: string;
  cpf?: string;
  rg?: string;
  contactItems: ContactItem[];
  contactFor: ContactFor[];
  accountId?: string;
  created_at: Date;
}

export interface ContactItem {
  id: string;
  type: "Celular" | "Telefone Residencial" | "Telefone Comercial" | "Email";
  contact: string;
  preferredContact: PreferredContact;
}

export interface PreferredContact {
  phone?: boolean;
  whatsapp?: boolean;
  email?: boolean;
}

export type ContactFor = "Faturamento" | "Marketing" | "Suporte" | "Comercial";
