import { singleton } from "@/app/lib/util/singleton";
import {
  IAccountRepository,
  IContact,
  IContactRepository,
} from "@/app/lib/@backend/domain";
import { contactRepository, accountRepository } from "@/app/lib/@backend/infra";

export type DeleteOutput = {
  success?: { deleted: boolean; contactId: string };
  error?: { global: string };
};

class DeleteOneContactUsecase {
  repository: IContactRepository;
  repositoryAccount: IAccountRepository;

  constructor() {
    this.repository = contactRepository;
    this.repositoryAccount = accountRepository;
  }

  async execute(input: Partial<IContact>): Promise<DeleteOutput> {
    try {
      const contactId = input.id;

      if (!contactId) {
        return {
          error: { global: "ID do contato não informado." },
        };
      }

      // 1. Excluir o contato principal
      await this.repository.deleteOne({ id: contactId });

      // 2. Remover esse contato de todas as contas
      const accounts = await this.repositoryAccount.findMany({
        "contacts.id": contactId,
      });

      for (const account of accounts.docs) {
        const updatedContacts = (account.contacts ?? []).filter(
          (c) => c.id !== contactId
        );

        await this.repositoryAccount.updateOne(
          { id: account.id },
          { $set: { contacts: updatedContacts } }
        );
      }

      return {
        success: { deleted: true, contactId },
      };
    } catch (err) {
      console.error("Erro ao deletar contato:", err);
      return {
        error: { global: "Erro inesperado ao deletar o contato." },
      };
    }
  }
}

export const deleteOneContactUsecase = singleton(DeleteOneContactUsecase);
