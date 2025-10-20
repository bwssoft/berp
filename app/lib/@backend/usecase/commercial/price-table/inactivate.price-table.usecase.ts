import { singleton } from "@/app/lib/util/singleton";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import type { IPriceTableRepository } from "@/backend/domain/commercial";
import type { IPriceTable } from "@/backend/domain/commercial/entity/price-table.definition";
import {
  priceTableRepository,
  priceTableSchedulerGateway,
} from "@/backend/infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";

namespace Dto {
  export type Input = { id: string };
  export type Output = {
    success: boolean;
    error?: { global?: string };
  };
}

class InactivatePriceTableUsecase {
  repository: IPriceTableRepository = priceTableRepository;

  private async inactivateTemporaryTable(
    priceTableId: string,
    current: IPriceTable
  ): Promise<Dto.Output> {
    const now = new Date();

    const updatedProv = await this.repository.updateOne(
      { id: priceTableId },
      { $set: { status: "INACTIVE", updated_at: now } }
    );

    if (current.endScheduleId) {
      try {
        await priceTableSchedulerGateway.deleteSchedule({
          scheduleId: current.endScheduleId,
        });
      } catch (error) {
        console.warn("Failed to delete end schedule:", error);
      }
    }

    if (!updatedProv) {
      return {
        success: false,
        error: { global: "Falha ao inativar tabela provisória." },
      };
    }

    // Reactivate paused normal table if exists
    await this.reactivatePausedNormalTable(priceTableId);

    return { success: true };
  }

  private async inactivateNormalTable(
    priceTableId: string
  ): Promise<Dto.Output> {
    const now = new Date();

    const updatedNorm = await this.repository.updateOne(
      { id: priceTableId },
      { $set: { status: "INACTIVE", updated_at: now } }
    );

    if (!updatedNorm) {
      return {
        success: false,
        error: { global: "Falha ao inativar tabela." },
      };
    }

    return { success: true };
  }

  private async reactivatePausedNormalTable(excludeId: string): Promise<void> {
    try {
      const pausedNormal = await this.repository.findOne({
        id: { $ne: excludeId },
        isTemporary: false,
        status: "PAUSED",
      });

      if (pausedNormal?.id) {
        const now = new Date();
        await this.repository.updateOne(
          { id: pausedNormal.id },
          { $set: { status: "ACTIVE", updated_at: now } }
        );
      }
    } catch (error) {
      console.warn("Failed to reactivate paused normal table:", error);
    }
  }

  private async createAuditRecord(
    current: IPriceTable,
    priceTableId: string
  ): Promise<void> {
    try {
      const after = await this.repository.findOne({ id: priceTableId });
      if (!after) {
        console.warn("Price table not found after inactivation for audit");
        return;
      }

      const session = await auth();
      if (session?.user) {
        const { name, id, email } = session.user;
        await createOneAuditUsecase.execute<IPriceTable, IPriceTable>({
          before: current,
          after,
          domain: AuditDomain.priceTable,
          user: { name, id, email },
          action: `Tabela de preços '${after.name}' teve status alterado para 'INATIVA'.`,
        });
      }
    } catch (error) {
      console.warn("Failed to create audit record:", error);
    }
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const current = await this.repository.findOne({ id: input.id });

      if (!current) {
        return {
          success: false,
          error: { global: "Tabela de preços não encontrada." },
        };
      }

      // Inactivate based on table type
      const result =
        current.isTemporary && current.endScheduleId
          ? await this.inactivateTemporaryTable(input.id, current)
          : await this.inactivateNormalTable(input.id);

      if (!result.success) {
        return result;
      }

      // Create audit record
      await this.createAuditRecord(current, input.id);

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
