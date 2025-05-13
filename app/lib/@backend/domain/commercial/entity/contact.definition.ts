export interface IContact {
  contractEnabled: boolean;
  name: string;
  positionOrRelation: string;
  department?: string;
  cpf?: string;
  rg?: string;
  contactItems: ContactItem[];
}

export interface ContactItem {
  type: "Celular" | "Telefone residencial" | "Telefone Comercial" | "Email";
  contact: string;
  preferred: PreferredContact;
  contactFor: ContactFor[];
}

export interface PreferredContact {
  phone?: boolean;
  whatsapp?: boolean;
  email?: boolean;
}

export type ContactFor = "Faturamento" | "Marketing" | "Suporte" | "Comercial";
