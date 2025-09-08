import { singleton } from "@/app/lib/util/singleton";
import {
  AuditDomain,
  IPriceTable,
  IPriceTableRepository,
} from "@/app/lib/@backend/domain";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";
import { priceTableRepository } from "../../../infra/repository/mongodb/commercial/price-table.repository";

namespace Dto {
  export type Input = {
    id: string;
  };

  export type Output = {
    success: boolean;
    error?: {
      global?: string;
    };
  };
}

class InactivatePriceTableUsecase {
  repository: IPriceTableRepository;

  constructor() {
    this.repository = priceTableRepository;
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const oldPriceTable = await this.repository.findOne({ id: input.id });
      if (!oldPriceTable) {
        return {
          success: false,
          error: { global: "Tabela de preços não encontrada" },
        };
      }

      // altera o status da tabela para inativo
      const updated = await this.repository.updateOne(
        { id: input.id },
        { $set: { status: "INACTIVE" } }
      );

      const after = await this.repository.findOne({ id: input.id });
      if (!after) {
        return {
          success: false,
          error: {
            global: "Tabela de preços não encontrada após atualização",
          },
        };
      }

      const session = await auth();
      const { name, id, email } = session?.user!;

      await createOneAuditUsecase.execute<IPriceTable, IPriceTable>({
        before: oldPriceTable,
        after,
        domain: AuditDomain.priceTable,
        user: { name, id, email },
        action: `Tabela de preços '${after.name}' teve status alterado para 'inativado'.`,
      });

      if (!updated) {
        return {
          success: false,
          error: {
            global: "Tabela de preços não encontrada ou não atualizada.",
          },
        };
      }

      return { success: true };
    } catch (err: any) {
      console.error("Erro ao inativar a tabela de preço:", err);
      return {
        success: false,
        error: {
          global: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }
}

export const inactivatePriceTableUsecase = singleton(
  InactivatePriceTableUsecase
);
