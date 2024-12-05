import { Address } from "./client.definition";

export interface IContact {
  id: string
  name: string;
  labels: { [label: string]: string }; // ["Presidente", "Proprietário"]
  email?: { [label: string]: string }
  phone?: { [label: string]: string }
  address?: Address
  can_sign_contract: boolean
  created_at: Date
}