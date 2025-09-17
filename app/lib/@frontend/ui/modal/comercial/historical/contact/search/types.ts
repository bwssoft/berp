import { IContact } from "@/app/lib/@backend/domain";

export interface ContactListItem {
  contactId: string;
  contactName: string;
  companyName?: string;
  documentValue?: string;
  positionOrRelation: string;
  department: string;
  contactFor: string[];
  contactItems: IContact["contactItems"];
  originType: string;
}
