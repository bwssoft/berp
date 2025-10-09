import { singleton } from "@/app/lib/util/singleton";
import { IPriceTableRepository } from "@/backend/domain/commercial/repository/price-table.repository";
import { priceTableRepository } from "@/backend/infra/mongodb/commercial/price-table.repository";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "@/backend/usecase/admin/audit/create-one.audit.usecase";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";

namespace Dto {
  export type Input = { id: string };
  export type Output = {
    success: boolean;
    error?: { global?: string };
  };
}

class ActivatePriceTableUsecase {
  repository: IPriceTableRepository = priceTableRepository;

  async execute(input: Dto.Input): Promise<Dto.Output> {
    const priceTable = await this.repository.findOne({ id: input.id });
    if (!priceTable) {
      return { success: false, error: { global: "Tabela de preços não encontrada." } };
    }

    if (priceTable.status === "ACTIVE") {
      return { success: true };
    }

    // 1) status esperado
    if (priceTable.status !== "AWAITING_PUBLICATION") {
      return { success: false, error: { global: "Tabela não está aguardando publicação." } };
    }

    // 2) Validação de tempo (defensiva, mesmo com agendador)
    const now = new Date();
    const start = priceTable.startDateTime;
    if (!start || now.getTime() < start.getTime()) {
      return { success: false, error: { global: "Ainda não é o horário de início da tabela." } };
    }

    if (priceTable.isTemporary) {
      if (!priceTable.endDateTime) {
        return { success: false, error: { global: "Tabela provisória requer data/hora de término." } };
      }
      const end = priceTable.endDateTime;
      if (now.getTime() >= end.getTime()) {
        return { success: false, error: { global: "A janela de ativação da provisória já encerrou." } };
      }
    }

    // 3) Transição por tipo
    if (priceTable.isTemporary) {
      // 3a) Provisória: pausar normal ativa; inativar outras provisórias ativas.
      // Pausar normal atualmente ativa (se houver)
      const normalsActive = await this.repository.findMany({
        id: { $ne: input.id },
        isTemporary: false,
        status: "ACTIVE",
      });

      for (const t of normalsActive.docs) {
        await this.repository.updateOne(
          { id: t.id! },
          { $set: { status: "PAUSED", updated_at: now } }
        );
      }

      // Inativar outras provisórias ativas (não tocar as AWAITING_PUBLICATION)
      const tempsActive = await this.repository.findMany({
        id: { $ne: input.id },
        isTemporary: true,
        status: "ACTIVE",
      });

      for (const t of tempsActive.docs) {
        await this.repository.updateOne(
          { id: t.id! },
          { $set: { status: "INACTIVE", updated_at: now } }
        );
      }

    } else {
      // 3b) Normal: inativar normais que estejam ACTIVE ou PAUSED (não tocar provisórias)
      const normalsActiveOrPaused = await this.repository.findMany({
        id: { $ne: input.id },
        isTemporary: false,
        status: { $in: ["ACTIVE", "PAUSED"] },
      });

      for (const t of normalsActiveOrPaused.docs) {
        await this.repository.updateOne(
          { id: t.id! },
          { $set: { status: "INACTIVE", updated_at: now } }
        );
      }
    }

    // 4) Ativar a tabela atual
    const updated = await this.repository.updateOne(
      { id: input.id },
      { $set: { status: "ACTIVE", updated_at: now } }
    );

    if (!updated) {
      return { success: false, error: { global: "Falha ao ativar tabela." } };
    }

    const after = await this.repository.findOne({ id: input.id });

    // 5) Auditoria
    const session = await auth();
    if (session?.user) {
      const { name: userName, email, id: user_id } = session.user;
      await createOneAuditUsecase.execute({
        before: priceTable,
        after: after!,
        domain: AuditDomain.priceTable,
        user: { email, name: userName, id: user_id },
        action: `Tabela de preços '${priceTable.name}' ativada.`,
      });
    }

    return { success: true };
  }
}

export const activatePriceTableUsecase = singleton(ActivatePriceTableUsecase);
