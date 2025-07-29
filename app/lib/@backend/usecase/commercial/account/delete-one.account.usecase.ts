import { singleton } from "@/app/lib/util/singleton";
import {
  AuditDomain,
  IAccount,
  IAccountRepository,
  IContactRepository,
  IAddressRepository,
} from "../../../domain";
import { accountRepository } from "../../../infra";
import { contactRepository } from "../../../infra/repository";
import { addressRepository } from "../../../infra/repository";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";

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
