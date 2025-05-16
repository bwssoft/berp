import { singleton } from "@/app/lib/util/singleton";
import { IAccount, IAccountRepository } from "../../../domain";
import { accountRepository } from "../../../infra";

export type Output = {
  success: boolean;
  error?: {
    global?: string;
  };
};
class CreateOneAccountUsecase {
  repository: IAccountRepository;

  constructor() {
    this.repository = accountRepository;
  }

  async execute(input: Omit<IAccount, "id" | "created_at">): Promise<Output> {
    try {
      const account: IAccount = {
        ...input,
        id: crypto.randomUUID(),
        created_at: new Date(),
      };

      await this.repository.create(account);

      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: { global: "Falha ao criar conta." },
      };
    }
  }
}

export const createOneAccountUsecase = singleton(CreateOneAccountUsecase);
