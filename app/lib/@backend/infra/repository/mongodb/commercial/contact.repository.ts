import { singleton } from "@/app/lib/util/singleton";
import { IContact } from "@/app/lib/@backend/domain";
import { BaseRepository } from "../@base";

class ContactRepository extends BaseRepository<IContact> {
  constructor() {
    super({
      collection: "commercial.contact",
      db: "berp",
    });
  }
}

export const contactRepository = singleton(ContactRepository);
