import type { Filter } from "mongodb";

import { accountRepository, contactRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";

class UpdateOneContactUsecase {
  repository: IContactRepository;
  repositoryAccount: IAccountRepository;

  constructor() {
    this.repository = contactRepository;
    this.repositoryAccount = accountRepository;
  }

  @RemoveMongoId()
  async execute(filter: Filter<IContact>, update: Partial<IContact>) {
    try {
      // 1. Atualiza o contato principal
      await this.repository.updateOne(filter, { $set: update });
      // 2. Busca o contato atualizado para obter o id correto
      const updatedContact = await this.repository.findOne({ id: filter.id });
      if (!updatedContact?.id) {
        return {
          error: { global: "Contato não encontrado após atualização." },
        };
      }

      const contactId = updatedContact.id;

      // 3. Busca todas as contas que contêm esse contato
      const accounts = await this.repositoryAccount.findMany({
        "contacts.id": contactId,
      });

      // 4. Atualiza o contato embutido em cada conta
      for (const account of accounts.docs) {
        const updatedContacts = (account.contacts ?? []).map((c) =>
          c.id === contactId ? { ...c, ...update } : c
        );

        await this.repositoryAccount.updateOne(
          { id: account.id },
          { $set: { contacts: updatedContacts } }
        );
      }

      return { success: updatedContact };
    } catch (err) {
      console.error("Erro ao atualizar contato:", err);
      return {
        error: { global: "Erro inesperado ao atualizar o contato." },
      };
    }
  }
}

export const updateOneContactUsecase = singleton(UpdateOneContactUsecase);
