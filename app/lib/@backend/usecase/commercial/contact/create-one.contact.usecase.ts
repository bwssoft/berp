import { singleton } from "@/app/lib/util/singleton";
import { AuditDomain, IContact, IContactRepository } from "../../../domain";
import { contactRepository } from "../../../infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";

export type Output = {
  success?: IContact;
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

      // Add audit log
      const session = await auth();
      if (session?.user) {
        const { name, email, id: user_id } = session.user;
        await createOneAuditUsecase.execute({
          after: contact,
          before: {},
          domain: AuditDomain.accountContact,
          user: { email, name, id: user_id },
          action: `Contato '${contact.name}' cadastrado para a conta ${contact.accountId}`,
        });
      }

      return { success: contact };
    } catch (error) {
      console.error(error);
      return {
        error: { global: "Falha ao criar contato." },
      };
    }
  }
}

export const createOneContactUsecase = singleton(CreateOneContactUsecase);
