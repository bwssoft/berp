import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import {
  AuditDomain,
  IAccountEconomicGroup,
  IAccountEconomicGroupRepository,
} from "../../../domain";
import { accountEconomicGroupRepository } from "../../../infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";

export type UpdateOneAccountEconomicGroupOutput = {
  success: boolean;
  data?: IAccountEconomicGroup;
  error?: {
    global?: string;
  };
};

class UpdateOneAccountEconomicGroupUsecase {
  repository: IAccountEconomicGroupRepository;

  constructor() {
    this.repository = accountEconomicGroupRepository;
  }

  @RemoveMongoId()
  async execute(
    filter: Filter<IAccountEconomicGroup>,
    update: Partial<IAccountEconomicGroup>
  ): Promise<UpdateOneAccountEconomicGroupOutput> {
    try {
      const before = await this.repository.findOne(filter);

      if (!before) {
        return {
          success: false,
          error: { global: "Grupo econômico de conta não encontrado." },
        };
      }

      await this.repository.updateOne(filter, { $set: update });

      const after = await this.repository.findOne(filter);

      // Add audit log
      const session = await auth();
      if (session?.user) {
        const { name, email, id: user_id } = session.user;
        await createOneAuditUsecase.execute({
          after: after || {},
          before,
          domain: AuditDomain.account,
          user: { email, name, id: user_id },
          action: `Grupo econômico de conta atualizado`,
        });
      }

      return { success: true, data: after || undefined };
    } catch {
      return {
        success: false,
        error: { global: "Falha ao atualizar grupo econômico de conta." },
      };
    }
  }
}

export const updateOneAccountEconomicGroupUsecase = singleton(
  UpdateOneAccountEconomicGroupUsecase
);
