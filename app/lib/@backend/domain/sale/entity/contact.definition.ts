export interface IContact {
  id: string
  name: string;
  label: ContactLabelEnum
  email: string
  phone: string
  can_sign_contract: boolean
  can_receive_document: boolean
  created_at: Date
}


export enum ContactLabelEnum {
  OWNER = "OWNER",
  SALE = "SALE",
  FINANCIAL = "FINANCIAL",
  TECHNICAL = "TECHNICAL",
  UNKNOWN = "UNKNOWN",
}