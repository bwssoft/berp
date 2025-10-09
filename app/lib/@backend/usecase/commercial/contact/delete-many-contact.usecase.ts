import { singleton } from "@/app/lib/util/singleton";

import {
  contactRepository,
  accountRepository,
} from "@/app/lib/@backend/infra/repository";

export type DeleteManyContactOutput = {
  success?: {
    deleted: boolean;
    deletedCount: number;
    contactIds: string[];
  };
  error?: { global: string };
};

class DeleteManyContactUsecase {
  repository: IContactRepository;
  repositoryAccount: IAccountRepository;

  constructor() {
    this.repository = contactRepository;
    this.repositoryAccount = accountRepository;
  }

  async execute(filter: Partial<IContact>): Promise<DeleteManyContactOutput> {
    try {
      // 1. Find all contacts that match the filter
      const contacts = await this.repository.findMany(filter);

      if (contacts.docs.length === 0) {
        return {
          success: { deleted: true, deletedCount: 0, contactIds: [] },
        };
      }

      const contactIds = contacts.docs
        .map((contact) => contact.id)
        .filter(Boolean) as string[];

      // 2. Delete all matching contacts
      await this.repository.deleteMany(filter);

      // 3. Remove these contacts from all accounts that reference them
      const accounts = await this.repositoryAccount.findMany({
        "contacts.id": { $in: contactIds },
      });

      for (const account of accounts.docs) {
        const updatedContacts = (account.contacts ?? []).filter(
          (contact) => !contactIds.includes(contact.id!)
        );

        await this.repositoryAccount.updateOne(
          { id: account.id },
          { $set: { contacts: updatedContacts } }
        );
      }

      return {
        success: {
          deleted: true,
          deletedCount: contactIds.length,
          contactIds,
        },
      };
    } catch (err) {
      console.error("Erro ao deletar contatos:", err);
      return {
        error: { global: "Erro inesperado ao deletar os contatos." },
      };
    }
  }
}

export const deleteManyContactUsecase = singleton(DeleteManyContactUsecase);
