import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";
import { IContact } from "@/backend/domain/commercial/entity/contact.definition";
import { IContactRepository } from "@/backend/domain/commercial/repository/contact.repository";
import { contactRepository } from "@/backend/infra";

class FindOneContactUsecase {
  repository: IContactRepository;

  constructor() {
    this.repository = contactRepository;
  }

  @RemoveMongoId()
  async execute(input: Filter<IContact>) {
    return await this.repository.findOne(input);
  }
}

export const findOneContactUsecase = singleton(FindOneContactUsecase);

