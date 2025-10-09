import { singleton } from "@/app/lib/util/singleton";
import { IPriceTableRepository } from "@/backend/domain/commercial/repository/price-table.repository";
import { priceTableRepository } from "@/backend/infra/mongodb/commercial/price-table.repository";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import { priceTableSchedulerGateway } from "@/backend/infra/gateway/price-table-scheduler";

namespace Dto {
  export type Input = { id: string };
  export type Output = {
    success: boolean;
    error?: { global?: string };
  };
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart.getTime() < bEnd.getTime() && aEnd.getTime() > bStart.getTime();
}

class PublishPriceTableUsecase {
  repository: IPriceTableRepository = priceTableRepository;

  async execute(input: Dto.Input): Promise<Dto.Output> {
    // 1) Carrega a tabela
    const priceTable = await this.repository.findOne({ id: input.id });
    if (!priceTable) {
      return {
        success: false,
        error: { global: "Tabela de preços não encontrada." },
      };
    }

    const now = new Date();
    const endDateTime = priceTable.endDateTime;
    if (priceTable.startDateTime.getTime() < now.getTime()) {
      return {
        success: false,
        error: { global: "A data/hora de início não pode estar no passado." },
      };
    }

    // 2) Busca outras tabelas
    const { docs } = await this.repository.findMany({});

    // 3) Regras de conflito
    if (priceTable.isTemporary) {
      // Provisória: sem overlap com provisórias ativas/aguardando
      if (!endDateTime) {
        return {
          success: false,
          error: { global: "Tabela provisória requer data/hora de término." },
        };
      }
      const hasOverlap = docs.some((item) => {
        if (item.id === priceTable.id) return false;
        if (!item.isTemporary) return false;
        if (item.status !== "ACTIVE" && item.status !== "AWAITING_PUBLICATION")
          return false;
        return overlaps(
          priceTable.startDateTime,
          endDateTime,
          item.startDateTime,
          item.endDateTime ?? item.startDateTime
        );
      });

      if (hasOverlap) {
        return {
          success: false,
          error: {
            global:
              "Conflito: já existe tabela provisória ativa ou programada no período informado.",
          },
        };
      }
    } else {
      // Normal: sem outra normal aguardando para o MESMO start
      const sameStartConflict = docs.some((item) => {
        if (item.id === priceTable.id) return false;
        if (item.isTemporary) return false;
        if (item.status !== "AWAITING_PUBLICATION") return false;
        return (
          item.startDateTime.getTime() === priceTable.startDateTime.getTime()
        );
      });

      if (sameStartConflict) {
        return {
          success: false,
          error: {
            global:
              "Conflito: já existe tabela normal programada para a mesma data/hora.",
          },
        };
      }
    }

    // 4) Atualiza status para "AWAITING_PUBLICATION"
    const updated = await this.repository.updateOne(
      { id: input.id },
      { $set: { status: "AWAITING_PUBLICATION", updated_at: new Date() } }
    );

    if (!updated) {
      return {
        success: false,
        error: { global: "Falha ao programar publicação." },
      };
    }

    // auditoria
    const session = await auth();
    if (session?.user) {
      const { name: userName, email, id: user_id } = session.user;
      await createOneAuditUsecase.execute({
        after: priceTable,
        before: {},
        domain: AuditDomain.priceTable,
        user: { email, name: userName, id: user_id },
        action: `Tabela de preços '${priceTable.name}' programada para publicação.`,
      });
    }

    try {
      const priceTableId = priceTable.id;
      if (!priceTableId) {
        console.error("❌ Price table ID is missing");
        return { success: true };
      }
      await priceTableSchedulerGateway.createSchedules({
        priceTableId,
        startDateTime: priceTable.startDateTime.toISOString(),
        endDateTime: (endDateTime ?? priceTable.startDateTime).toISOString(),
      });
    } catch (schedulerError) {
      console.warn(
        "⚠️ Price table published but scheduling failed. Manual activation may be needed."
      );
    }

    return { success: true };
  }
}

export const publishPriceTableUsecase = singleton(PublishPriceTableUsecase);
