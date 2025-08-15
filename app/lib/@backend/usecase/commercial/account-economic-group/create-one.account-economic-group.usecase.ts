import { singleton } from "@/app/lib/util/singleton";
import {
  AuditDomain,
  IAccountEconomicGroup,
  IAccountEconomicGroupRepository,
} from "../../../domain";
import { accountEconomicGroupRepository } from "../../../infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";

export type CreateOneAccountEconomicGroupOutput = {
  success: boolean;
  data?: IAccountEconomicGroup;
  error?: {
    global?: string;
  };
};

class CreateOneAccountEconomicGroupUsecase {
  repository: IAccountEconomicGroupRepository;

  constructor() {
    this.repository = accountEconomicGroupRepository;
  }

  async execute(
    input: Omit<IAccountEconomicGroup, "id">
  ): Promise<CreateOneAccountEconomicGroupOutput> {
    try {
      const accountEconomicGroup: IAccountEconomicGroup = {
        ...input,
        id: crypto.randomUUID(),
      };

      await this.repository.create(accountEconomicGroup);

      // Add audit log
      const session = await auth();
      if (session?.user) {
        const { name, email, id: user_id } = session.user;
        await createOneAuditUsecase.execute({
          after: accountEconomicGroup,
          before: {},
          domain: AuditDomain.account,
          user: { email, name, id: user_id },
          action: `Grupo econômico de conta cadastrado`,
        });
      }

      return { success: true, data: accountEconomicGroup };
    } catch {
      return {
        success: false,
        error: { global: "Falha ao criar grupo econômico de conta." },
      };
    }
  }
}

export const createOneAccountEconomicGroupUsecase = singleton(
  CreateOneAccountEconomicGroupUsecase
);
