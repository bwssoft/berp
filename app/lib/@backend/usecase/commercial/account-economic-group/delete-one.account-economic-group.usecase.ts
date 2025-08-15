import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import {
  AuditDomain,
  IAccountEconomicGroup,
  IAccountEconomicGroupRepository,
} from "../../../domain";
import { accountEconomicGroupRepository } from "../../../infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";

export type DeleteOneAccountEconomicGroupOutput = {
  success: boolean;
  error?: {
    global?: string;
  };
};

class DeleteOneAccountEconomicGroupUsecase {
  repository: IAccountEconomicGroupRepository;

  constructor() {
    this.repository = accountEconomicGroupRepository;
  }

  @RemoveMongoId()
  async execute(
    filter: Partial<IAccountEconomicGroup>
  ): Promise<DeleteOneAccountEconomicGroupOutput> {
    try {
      const before = await this.repository.findOne(filter);

      if (!before) {
        return {
          success: false,
          error: { global: "Grupo econômico de conta não encontrado." },
        };
      }

      await this.repository.deleteOne(filter);

      // Add audit log
      const session = await auth();
      if (session?.user) {
        const { name, email, id: user_id } = session.user;
        await createOneAuditUsecase.execute({
          after: {},
          before,
          domain: AuditDomain.account,
          user: { email, name, id: user_id },
          action: `Grupo econômico de conta excluído`,
        });
      }

      return { success: true };
    } catch {
      return {
        success: false,
        error: { global: "Falha ao excluir grupo econômico de conta." },
      };
    }
  }
}

export const deleteOneAccountEconomicGroupUsecase = singleton(
  DeleteOneAccountEconomicGroupUsecase
);
