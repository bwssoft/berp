export interface IContact {
  id: string;
  role: ContactRoleEnum;
  department: ContactDepartmentEnum;
  name: string;
  email: string;
  phone: string;
  can_sign_contract: boolean;
  can_receive_document: boolean;
  created_at: Date;
  accountId: string[];
}

export enum ContactRoleEnum {
  analyst = "analyst",
  supervisor = "supervisor",
  manager = "manager",
  director = "director",
  president = "president",
  owner = "owner",
  other = "other",
}

export enum ContactDepartmentEnum {
  administrative = "administrative",
  commercial = "commercial",
  purchasing = "purchasing",
  financial = "financial",
  logistics = "logistics",
  operations = "operations",
  presidency = "presidency",
  product = "product",
  owner = "owner",
  support = "support",
  other = "other",
}
