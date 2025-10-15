import { singleton } from "@/app/lib/util/singleton";
import { BaseRepository } from "../@base";
import { IContact } from "@/backend/domain/commercial/entity/contact.definition";

class ContactRepository extends BaseRepository<IContact> {
  constructor() {
    super({
      collection: "commercial.contact",
      db: "berp",
    });
  }
}

export const contactRepository = singleton(ContactRepository);

