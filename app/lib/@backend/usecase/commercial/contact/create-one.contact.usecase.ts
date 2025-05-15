import { singleton } from "@/app/lib/util/singleton";
import { IContact, IContactRepository } from "../../../domain";
import { contactRepository } from "../../../infra";

export type Output = {
  success: boolean;
  error?: {
    global?: string;
  };
};
class CreateOneContactUsecase {
  repository: IContactRepository;

  constructor() {
    this.repository = contactRepository;
  }

  async execute(input: Omit<IContact, "id" | "created_at">): Promise<Output> {
    try {
      const contact: IContact = {
        ...input,
        id: crypto.randomUUID(),
        created_at: new Date(),
      };

      await this.repository.create(contact);

      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: { global: "Falha ao criar contato." },
      };
    }
  }
}

export const createOneContactUsecase = singleton(CreateOneContactUsecase);
