import { singleton } from "@/app/lib/util/singleton";
import { normalizeString } from "@/app/lib/util/normalize-string";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import type { IPriceTable } from "@/backend/domain/commercial/entity/price-table.definition";
import type { IPriceTableRepository } from "@/backend/domain/commercial";
import {
  priceTableRepository,
  priceTableSchedulerGateway,
} from "@/backend/infra";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";
import { findManyPriceTableUsecase } from "@/backend/usecase/commercial/price-table/find-many.price-table.usecase";

namespace Dto {
  export type Input = IPriceTable;

  export type Output = {
    success: boolean;
    error?: {
      global?: string;
      name?: string;
      startDateTime?: string;
      endDateTime?: string;
      notFound?: string;
    };
  };
}

class UpdateOnePriceTableUsecase {
  repository: IPriceTableRepository = priceTableRepository;

  private validateDateTimes(input: Dto.Input): Dto.Output | null {
    const nowIso = new Date();

    if (input.startDateTime < nowIso) {
      return {
        success: false,
        error: {
          startDateTime: "A data/hora de início não pode estar no passado.",
        },
      };
    }

    if (input.isTemporary) {
      if (!input.endDateTime) {
        return {
          success: false,
          error: {
            endDateTime:
              "Para tabela provisória, informe a data/hora de término.",
          },
        };
      }
      if (input.endDateTime <= input.startDateTime) {
        return {
          success: false,
          error: { endDateTime: "Término deve ser maior que o início." },
        };
      }
    } else if (input.endDateTime && input.endDateTime < input.startDateTime) {
      return {
        success: false,
        error: { endDateTime: "Término não pode ser menor que o início." },
      };
    }

    return null;
  }

  private async validateNameUniqueness(
    input: Dto.Input,
    existing: IPriceTable
  ): Promise<Dto.Output | null> {
    if (input.name !== existing.name) {
      const { docs } = await findManyPriceTableUsecase.execute({});
      const normalized = normalizeString(input.name);
      const duplicated = docs.find(
        (t) => t.id !== existing.id && normalizeString(t.name) === normalized
      );
      if (duplicated) {
        return {
          success: false,
          error: {
            global: "Já existe uma Tabela de Preços com este nome.",
            name: "Nome já está em uso.",
          },
        };
      }
    }
    return null;
  }

  private async cancelExistingSchedules(existing: IPriceTable): Promise<void> {
    try {
      if (existing.startScheduleId) {
        await priceTableSchedulerGateway.deleteSchedule({
          scheduleId: existing.startScheduleId,
        });
      }

      if (existing.isTemporary && existing.endScheduleId) {
        await priceTableSchedulerGateway.deleteSchedule({
          scheduleId: existing.endScheduleId,
        });
      }
    } catch (error) {
      console.warn("Failed to cancel existing schedules:", error);
    }
  }

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const existing = await this.repository.findOne({ id: input.id });
      if (!existing) {
        return {
          success: false,
          error: { notFound: "Tabela de Preços não encontrada." },
        };
      }

      // Validate date times
      const dateValidationError = this.validateDateTimes(input);
      if (dateValidationError) {
        return dateValidationError;
      }

      // Validate name uniqueness
      const nameValidationError = await this.validateNameUniqueness(
        input,
        existing
      );
      if (nameValidationError) {
        return nameValidationError;
      }

      // Cancel existing schedules
      await this.cancelExistingSchedules(existing);

      // Update the price table
      const updateResult = await this.updatePriceTable(input, existing);
      if (!updateResult.success) {
        return updateResult;
      }

      // Create audit record
      if (existing.id) {
        await this.createAuditRecord(existing, existing.id);
      }

      return { success: true };
    } catch (err) {
      console.error("Falha ao atualizar Tabela de Preços:", err);
      return {
        success: false,
        error: { global: "Falha ao atualizar Tabela de Preços." },
      };
    }
  }

  private async updatePriceTable(
    input: Dto.Input,
    existing: IPriceTable
  ): Promise<Dto.Output> {
    const updatedAt = new Date();
    const updated = await this.repository.updateOne(
      { id: existing.id },
      {
        $set: {
          name: input.name,
          startDateTime: input.startDateTime,
          endDateTime: input.isTemporary ? input.endDateTime : undefined,
          isTemporary: input.isTemporary,
          status: "DRAFT",
          groups: input.groups,
          equipmentPayment: input.equipmentPayment,
          equipmentSimcardPayment: input.equipmentSimcardPayment,
          simcardPayment: input.simcardPayment,
          servicePayment: input.servicePayment,
          startScheduleId: undefined,
          endScheduleId: undefined,
          updated_at: updatedAt,
        },
      }
    );

    if (!updated) {
      return {
        success: false,
        error: { global: "Tabela de Preços não atualizada." },
      };
    }

    return { success: true };
  }

  private async createAuditRecord(
    existing: IPriceTable,
    priceTableId: string
  ): Promise<void> {
    try {
      const after = await this.repository.findOne({ id: priceTableId });
      const session = await auth();

      if (session?.user && after) {
        const { name: userName, email, id: user_id } = session.user;
        await createOneAuditUsecase.execute<IPriceTable, IPriceTable>({
          before: existing,
          after,
          domain: AuditDomain.priceTable,
          user: { email, name: userName, id: user_id },
          action: `Tabela de preços '${after.name}' atualizada.`,
        });
      }
    } catch (error) {
      console.warn("Failed to create audit record:", error);
    }
  }
}

export const updateOnePriceTableUsecase = singleton(UpdateOnePriceTableUsecase);
