import { singleton } from "@/app/lib/util/singleton";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import type { IPriceTableRepository } from "@/backend/domain/commercial";
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
    error?: {
      global?: string;
      fields?: {
        startDateTime?: string;
        endDateTime?: string;
      };
    };
  };
}

interface PriceTableDoc {
  id: string;
  isTemporary: boolean;
  status: string;
  startDateTime: Date;
  endDateTime?: Date;
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart.getTime() < bEnd.getTime() && aEnd.getTime() > bStart.getTime();
}

function isSameMinute(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate() &&
    date1.getHours() === date2.getHours() &&
    date1.getMinutes() === date2.getMinutes()
  );
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

    // 2) Validação de data/hora não pode estar no passado
    if (priceTable.startDateTime.getTime() < now.getTime()) {
      return {
        success: false,
        error: {
          global: "A data/hora de início não pode estar no passado.",
          fields: { startDateTime: "Data/hora não pode estar no passado" },
        },
      };
    }

    const endDateTime = priceTable.endDateTime;
    if (endDateTime && endDateTime.getTime() < now.getTime()) {
      return {
        success: false,
        error: {
          global: "A data/hora de término não pode estar no passado.",
          fields: { endDateTime: "Data/hora não pode estar no passado" },
        },
      };
    }

    // 3) Busca outras tabelas
    const { docs } = await this.repository.findMany({});

    // 4) Regras de conflito conforme documento
    if (priceTable.isTemporary) {
      // ========== TABELA PROVISÓRIA ==========
      if (!endDateTime) {
        return {
          success: false,
          error: {
            global: "Tabela provisória requer data/hora de término.",
            fields: { endDateTime: "Campo obrigatório para tabela provisória" },
          },
        };
      }

      // Verifica conflito com TABELAS NORMAIS (não pode ter o mesmo minuto de início)
      const normalConflict = docs.some((item) => {
        if (item.id === priceTable.id) return false;
        if (item.isTemporary) return false;
        if (
          item.status !== "ACTIVE" &&
          item.status !== "AWAITING_PUBLICATION"
        ) {
          return false;
        }

        return isSameMinute(priceTable.startDateTime, item.startDateTime);
      });

      if (normalConflict) {
        return {
          success: false,
          error: {
            global:
              "Uma tabela provisória não pode iniciar no mesmo horário (minuto) de uma tabela normal.",
            fields: {
              startDateTime: "Conflito de horário com tabela normal",
            },
          },
        };
      }

      // Verifica se existe outra tabela provisória ATIVA ou AGUARDANDO PUBLICAÇÃO
      // que tenha overlap no período (não pode ter nenhum overlap)
      const provisoryOverlap = docs.find((item) => {
        if (item.id === priceTable.id) return false;
        if (!item.isTemporary) return false;

        // Apenas verifica tabelas ativas ou aguardando publicação
        if (
          item.status !== "ACTIVE" &&
          item.status !== "AWAITING_PUBLICATION"
        ) {
          return false;
        }

        const itemEnd = item.endDateTime ?? item.startDateTime;
        return overlaps(
          priceTable.startDateTime,
          endDateTime,
          item.startDateTime,
          itemEnd
        );
      });

      if (provisoryOverlap) {
        const conflictEnd =
          provisoryOverlap.endDateTime ?? provisoryOverlap.startDateTime;
        const conflictStart = provisoryOverlap.startDateTime;

        return {
          success: false,
          error: {
            global: `Já existe uma tabela provisória no período de ${conflictStart.toLocaleString("pt-BR")} até ${conflictEnd.toLocaleString("pt-BR")}. Você deve agendar antes ou depois deste período.`,
            fields: {
              startDateTime: "Conflito de período",
              endDateTime: "Conflito de período",
            },
          },
        };
      }
    } else {
      // ========== TABELA NORMAL ==========

      // Verifica se existe outra tabela normal AGUARDANDO PUBLICAÇÃO
      // com o MESMO minuto de início
      const normalConflict = docs.some((item) => {
        if (item.id === priceTable.id) return false;
        if (item.isTemporary) return false;
        if (item.status !== "AWAITING_PUBLICATION") return false;

        return isSameMinute(priceTable.startDateTime, item.startDateTime);
      });

      if (normalConflict) {
        return {
          success: false,
          error: {
            global:
              "Já existe uma tabela normal aguardando publicação que será ativada no mesmo horário (minuto). O horário deve ser diferente.",
            fields: {
              startDateTime: "Conflito de horário de início",
            },
          },
        };
      }

      // Verifica se existe alguma tabela PROVISÓRIA que inicia no mesmo minuto
      const provisoryConflict = docs.some((item) => {
        if (item.id === priceTable.id) return false;
        if (!item.isTemporary) return false;
        if (
          item.status !== "ACTIVE" &&
          item.status !== "AWAITING_PUBLICATION"
        ) {
          return false;
        }

        return isSameMinute(priceTable.startDateTime, item.startDateTime);
      });

      if (provisoryConflict) {
        return {
          success: false,
          error: {
            global:
              "Uma tabela normal não pode iniciar no mesmo horário (minuto) de uma tabela provisória.",
            fields: {
              startDateTime: "Conflito de horário com tabela provisória",
            },
          },
        };
      }
    }

    // 5) Criar agendamento ANTES de mudar o status
    try {
      const priceTableId = priceTable.id;
      if (!priceTableId) {
        return {
          success: false,
          error: { global: "ID da tabela de preços está ausente." },
        };
      }

      await priceTableSchedulerGateway.createSchedules({
        priceTableId,
        startDateTime: priceTable.startDateTime.toISOString(),
        endDateTime:
          endDateTime?.toISOString() ?? priceTable.startDateTime.toISOString(),
      });
    } catch (schedulerError) {
      console.error("❌ Erro ao criar agendamento:", schedulerError);
      return {
        success: false,
        error: {
          global:
            "Falha ao agendar a publicação. Tente novamente ou contate o suporte.",
        },
      };
    }

    // 6) SOMENTE após sucesso do scheduler, atualiza status para "AWAITING_PUBLICATION"
    const updated = await this.repository.updateOne(
      { id: input.id },
      { $set: { status: "AWAITING_PUBLICATION", updated_at: new Date() } }
    );

    if (!updated) {
      // Se falhar ao atualizar, idealmente deveria cancelar o agendamento (colocar aq mama)
      console.error(
        "❌ Falha ao atualizar status da tabela após criar agendamento"
      );
      return {
        success: false,
        error: {
          global:
            "Falha ao programar publicação. O agendamento foi criado mas o status não foi atualizado.",
        },
      };
    }

    // 7) Auditoria
    const session = await auth();
    if (session?.user) {
      const { name: userName, email, id: user_id } = session.user;
      await createOneAuditUsecase.execute({
        after: { ...priceTable, status: "AWAITING_PUBLICATION" },
        before: priceTable,
        domain: AuditDomain.priceTable,
        user: { email, name: userName, id: user_id },
        action: `Tabela de preços '${priceTable.name}' programada para publicação.`,
      });
    }

    return { success: true };
  }
}

export const publishPriceTableUsecase = singleton(PublishPriceTableUsecase);
