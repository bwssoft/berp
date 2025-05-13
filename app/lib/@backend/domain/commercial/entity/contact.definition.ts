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
  type: "Business Phone" | "Home Phone" | "Mobile" | "Email";
  contact: string;
  preferred: PreferredContact;
  contactFor: ContactFor[];
}

export interface PreferredContact {
  phone?: boolean;
  whatsapp?: boolean;
  email?: boolean;
}

export type ContactFor = "Sales" | "Support" | "Billing" | "Marketing";
