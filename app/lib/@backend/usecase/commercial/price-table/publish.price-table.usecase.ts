import { singleton } from "@/app/lib/util/singleton";
import { IPriceTableRepository } from "../../../domain/commercial/repository/price-table.repository";
import { priceTableRepository } from "../../../infra/repository/mongodb/commercial/price-table.repository";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";
import { AuditDomain } from "../../../domain/admin/entity/audit.definition";

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
      return { success: false, error: { global: "Tabela de preços não encontrada." } };
    }

    const now = new Date();
    if (priceTable.startDateTime.getTime() < now.getTime()) {
      return { success: false, error: { global: "A data/hora de início não pode estar no passado." } };
    }

    // 2) Busca outras tabelas
    const { docs } = await this.repository.findMany({});

    // 3) Regras de conflito
    if (priceTable.isTemporary) {
      // Provisória: sem overlap com provisórias ativas/aguardando
      if (!priceTable.endDateTime) {
        return { success: false, error: { global: "Tabela provisória requer data/hora de término." } };
      }
      const hasOverlap = docs.some((item) => {
        if (item.id === priceTable.id) return false;
        if (!item.isTemporary) return false;
        if (item.status !== "ativa" && item.status !== "aguardando publicação") return false;
        return overlaps(
          priceTable.startDateTime,
          priceTable.endDateTime,
          item.startDateTime,
          item.endDateTime
        );
      });

      if (hasOverlap) {
        return {
          success: false,
          error: { global: "Conflito: já existe tabela provisória ativa ou programada no período informado." }
        };
      }
    } else {
      // Normal: sem outra normal aguardando para o MESMO start
      const sameStartConflict = docs.some((item) => {
        if (item.id === priceTable.id) return false;
        if (item.isTemporary) return false;
        if (item.status !== "aguardando publicação") return false;
        return item.startDateTime.getTime() === priceTable.startDateTime.getTime();
      });

      if (sameStartConflict) {
        return {
          success: false,
          error: { global: "Conflito: já existe tabela normal programada para a mesma data/hora." }
        };
      }
    }

    // 4) Atualiza status para "aguardando publicação"
    const updated = await this.repository.updateOne(
      { id: input.id },
      { $set: { status: "aguardando publicação", updated_at: new Date() } }
    );

    if (!updated) {
      return { success: false, error: { global: "Falha ao programar publicação." } };
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

    return { success: true };
  }
}

export const publishPriceTableUsecase = singleton(PublishPriceTableUsecase);
