import { singleton } from "@/app/lib/util/singleton";
import { IContact, IContactRepository } from "@/app/lib/@backend/domain";
import { contactRepository } from "../../../infra/repository";
class CreateOneContactUsecase {
  repository: IContactRepository;

  constructor() {
    this.repository = contactRepository;
  }

  async execute(input: Omit<IContact, "id" | "created_at" | "updated_at">) {
    const contact = {
      ...input,
      id: crypto.randomUUID(),
      created_at: new Date(),
    };
    return await this.repository.create(contact);
  }
}

export const createOneContactUsecase = singleton(CreateOneContactUsecase);
