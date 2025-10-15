import { singleton } from "@/app/lib/util/singleton";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import { IAccount } from "@/backend/domain/commercial/entity/account.definition";
import { IAccountRepository } from "@/backend/domain/commercial/repository/account.repository";
import { IContactRepository } from "@/backend/domain/commercial/repository/contact.repository";
import { IAddressRepository } from "@/backend/domain/commercial/repository/address.repository";
import { accountRepository } from "@/backend/infra";
import { contactRepository } from "@/backend/infra";
import { addressRepository } from "@/backend/infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";

export type DeleteAccountOutput = {
  success?: { deleted: boolean; accountId: string };
  error?: { global: string };
};

class DeleteOneAccountUsecase {
  repository: IAccountRepository;
  contactRepository: IContactRepository;
  addressRepository: IAddressRepository;

  constructor() {
    this.repository = accountRepository;
    this.contactRepository = contactRepository;
    this.addressRepository = addressRepository;
  }

  async execute(input: Partial<IAccount>): Promise<DeleteAccountOutput> {
    try {
      const accountId = input.id;

      if (!accountId) {
        return {
          error: { global: "ID da conta não informado." },
        };
      }

      // First, get the account data for audit purposes
      const account = await this.repository.findOne({ id: accountId });
      if (!account) {
        return {
          error: { global: "Conta não encontrada." },
        };
      }

      // 1. Delete all contacts associated with this account
      await this.contactRepository.deleteMany({ accountId });

      // 2. Delete all addresses associated with this account
      await this.addressRepository.deleteMany({ accountId });

      // 3. Delete the account itself
      await this.repository.deleteOne({ id: accountId });

      // Add audit log
      try {
        const session = await auth();
        if (session?.user) {
          const { name, email, id: user_id } = session.user;
          await createOneAuditUsecase.execute({
            after: {},
            before: account,
            domain: AuditDomain.account,
            user: { email, name, id: user_id },
            action: `Conta '${account.document?.type === "cpf" ? account.name : account.fantasy_name || account.social_name}' excluída`,
          });
        }
      } catch (auditError) {
        console.warn("Failed to create audit log:", auditError);
        // Don't fail the deletion if audit fails
      }

      return {
        success: { deleted: true, accountId },
      };
    } catch (err) {
      console.error("Erro ao deletar conta:", err);
      return {
        error: { global: "Erro inesperado ao deletar a conta." },
      };
    }
  }
}

export const deleteOneAccountUsecase = singleton(DeleteOneAccountUsecase);
