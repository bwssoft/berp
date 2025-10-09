import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import { IAccountEconomicGroup } from "@/backend/domain/commercial/entity/account.economic-group.definition";
import { IAccountEconomicGroupRepository } from "@/backend/domain/commercial/repository/account.economic-group.repository";
import { accountEconomicGroupRepository } from "@/backend/infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";

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

