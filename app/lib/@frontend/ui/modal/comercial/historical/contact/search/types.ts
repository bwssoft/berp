import {IContact} from "@/backend/domain/commercial/entity/contact.definition";

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

