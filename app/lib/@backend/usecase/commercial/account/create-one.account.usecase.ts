import { singleton } from "@/app/lib/util/singleton";
import { AuditDomain, IAccount, IAccountRepository } from "../../../domain";
import { accountRepository } from "../../../infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";

export type Output = {
  success: boolean;
  id?: string;
  error?: {
    global?: string;
    cnpj?: string;
  };
};

class CreateOneAccountUsecase {
  repository: IAccountRepository;

  constructor() {
    this.repository = accountRepository;
  }

  async execute(input: Omit<IAccount, "id" | "created_at">): Promise<Output> {
    try {
      const duplicated = await this.repository.findOne({
        "document.value": input.document.value,
        "document.type": "cnpj",
      });

      if (duplicated) {
        return {
          success: false,
          error: { cnpj: "CNPJ já cadastrado." },
        };
      }

      const account: IAccount = {
        ...input,
        id: crypto.randomUUID(),
        created_at: new Date(),
      };

      await this.repository.create(account);

      // Add audit log
      const session = await auth();
      if (session?.user) {
        const { name, email, id: user_id } = session.user;
        await createOneAuditUsecase.execute({
          after: account,
          before: {},
          domain: AuditDomain.account,
          user: { email, name, id: user_id },
          action: `Conta '${account.document.type === "cpf" ? account.name : account.fantasy_name || account.social_name}' cadastrada`,
        });
      }

      return { success: true, id: account.id };
    } catch {
      return {
        success: false,
        error: { global: "Falha ao criar conta." },
      };
    }
  }
}

export const createOneAccountUsecase = singleton(CreateOneAccountUsecase);
