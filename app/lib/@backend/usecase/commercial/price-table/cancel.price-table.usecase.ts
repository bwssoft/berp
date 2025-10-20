import { singleton } from "@/app/lib/util/singleton";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import type { IPriceTableRepository } from "@/backend/domain/commercial";
import type {
  CancelPriceTableSchedulePayload,
  IPriceTable,
} from "@/backend/domain/commercial/entity/price-table.definition";
import {
  priceTableRepository,
  priceTableSchedulerGateway,
} from "@/backend/infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";

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

      await this.cancelExistingSchedules(oldPriceTable);

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

  private async cancelExistingSchedules(
    priceTable: IPriceTable
  ): Promise<void> {
    const scheduleIds: string[] = [];

    const { startScheduleId, endScheduleId, isTemporary } = priceTable;

    if (startScheduleId) {
      scheduleIds.push(startScheduleId);
    }

    if (isTemporary) {
      if (endScheduleId && !scheduleIds.includes(endScheduleId)) {
        scheduleIds.push(endScheduleId);
      }
    } else if (endScheduleId && !scheduleIds.includes(endScheduleId)) {
      scheduleIds.push(endScheduleId);
    }

    if (!scheduleIds.length) {
      return;
    }

    await Promise.all(
      scheduleIds.map(async (scheduleId) => {
        try {
          const payload: CancelPriceTableSchedulePayload = { scheduleId };
          await priceTableSchedulerGateway.deleteSchedule(payload);
        } catch (error) {
          console.warn(
            `Failed to cancel schedule '${scheduleId}' for price table '${priceTable.id}':`,
            error
          );
        }
      })
    );
  }
}

export const cancelPriceTableUsecase = singleton(CancelPriceTableUsecase);
