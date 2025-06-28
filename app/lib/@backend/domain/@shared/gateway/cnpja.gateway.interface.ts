export interface ICnpjaResponse {
  updated: string;
  taxId: string;
  alias: string;
  founded: string;
  head: boolean;
  company: Company;
  statusDate: string;
  status: Status;
  address: Address;
  mainActivity: Activity;
  phones: Phone[];
  emails: Email[];
  sideActivities: Activity[];
  registrations: Registration[];
}

export interface Company {
  id: number;
  name: string; // razão social
  equity: number;
  nature: Nature;
  size: Size;
  simples: OptionStatus;
  simei: OptionStatus;
  members: Member[];
}

export interface Member {
  since: string;
  person: Person;
  role: Role;
}

export interface Person {
  id: string;
  type: "NATURAL" | "LEGAL";
  name: string;
  taxId: string;
  age: string;
}

export interface Role {
  id: number;
  text: string;
}

export interface Nature {
  id: number;
  text: string;
}

export interface Size {
  id: number;
  acronym: string;
  text: string;
}

export interface OptionStatus {
  optant: boolean;
  since: string | null;
}

export interface Status {
  id: number;
  text: string;
}

export interface Address {
  municipality: number;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  details: string | null;
  zip: string;
  country: Country;
}

export interface Country {
  id: number;
  name: string;
}

export interface Activity {
  id: number;
  text: string;
}

export interface Phone {
  type: "LANDLINE" | "MOBILE" | string;
  area: string;
  number: string;
}

export interface Email {
  ownership: "CORPORATE" | "PERSONAL" | string;
  address: string;
  domain: string;
}

export interface Registration {
  number: string;
  state: string;
  enabled: boolean;
  statusDate: string;
  status: Status;
  type: RegistrationType;
}

export interface RegistrationType {
  id: number;
  text: string;
}

export interface ICnpjaGateway {
  getCnpjData(cnpj: string): Promise<ICnpjaResponse | null>;
  getByName(alias: string): Promise<ICnpjaResponse[] | null>;
}
