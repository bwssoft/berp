import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { IContact } from "@/app/lib/@backend/domain/commercial/entity/contact.definition";
import { IContactRepository } from "@/app/lib/@backend/domain/commercial/repository/contact.repository";
import { contactRepository } from "@/app/lib/@backend/infra";

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
