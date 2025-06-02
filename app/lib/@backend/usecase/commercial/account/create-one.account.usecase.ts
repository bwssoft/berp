import { singleton } from "@/app/lib/util/singleton";
import { IAccount, IAccountRepository } from "../../../domain";
import { accountRepository } from "../../../infra";

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
