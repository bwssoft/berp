import { singleton } from "@/app/lib/util/singleton";

import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";
import { priceTableRepository } from "../../../infra/repository/mongodb/commercial/price-table.repository";
import { priceTableSchedulerGateway } from "../../../infra/gateway/price-table-scheduler";

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

class CancelPriceTableUsecase {
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

      // altera o status da tabela para cancelada
      const updated = await this.repository.updateOne(
        { id: input.id },
        { $set: { status: "CANCELLED" } }
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
        action: `Tabela de preços '${after.name}' teve status alterado para 'cancelada'.`,
      });

      if (!updated) {
        return {
          success: false,
          error: {
            global: "Tabela de preços não encontrada ou não atualizada.",
          },
        };
      }

      // Cancel any pending schedules for this price table
      await this.cancelExistingSchedules(input.id);

      return { success: true };
    } catch (err: any) {
      console.error("Erro ao cancelar tabela de preço:", err);
      return {
        success: false,
        error: {
          global: err instanceof Error ? err.message : JSON.stringify(err),
        },
      };
    }
  }

  private async cancelExistingSchedules(priceTableId: string): Promise<void> {
    try {
      await priceTableSchedulerGateway.deleteSchedule(priceTableId);
    } catch (error) {
      console.warn("⚠️ Failed to cancel existing schedules:", error);
    }
  }
}

export const cancelPriceTableUsecase = singleton(CancelPriceTableUsecase);
