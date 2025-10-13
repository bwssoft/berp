import { singleton } from "@/app/lib/util/singleton";
import { normalizeString } from "@/app/lib/util/normalize-string";
import { AuditDomain } from "@/backend/domain/admin/entity/audit.definition";
import type { IPriceTable } from "@/backend/domain/commercial/entity/price-table.definition";
import type { IPriceTableRepository } from "@/backend/domain/commercial";
import { priceTableRepository } from "@/backend/infra";
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

  async execute(input: Dto.Input): Promise<Dto.Output> {
    const nowIso = new Date();
    try {
      const existing = await this.repository.findOne({ id: input.id });
      if (!existing) {
        return {
          success: false,
          error: { notFound: "Tabela de Preços não encontrada." },
        };
      }

      // (talvez eu adicione essas validações no form do front tbm, mas to mantendo aq pra garantir)
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

      // Unicidade de nome (CI) só se o nome mudou
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

      const updatedAt = new Date();
      const updated = await this.repository.updateOne(
        { id: existing.id },
        {
          $set: {
            name: input.name,
            startDateTime: input.startDateTime,
            endDateTime: input.isTemporary ? input.endDateTime : undefined,
            isTemporary: input.isTemporary,
            //se editar e salvar enquanto status for Aguardando Publicação, voltar o status para Rascunho.
            status:
              input.status == "AWAITING_PUBLICATION" ? "DRAFT" : input.status,
            groups: input.groups,
            equipmentPayment: input.equipmentPayment,
            equipmentSimcardPayment: input.equipmentSimcardPayment,
            simcardPayment: input.simcardPayment,
            servicePayment: input.servicePayment,
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

      const after = await this.repository.findOne({ id: existing.id });

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

      return { success: true };
    } catch (err) {
      console.error("Falha ao atualizar Tabela de Preços:", err);
      return {
        success: false,
        error: { global: "Falha ao atualizar Tabela de Preços." },
      };
    }
  }
}

export const updateOnePriceTableUsecase = singleton(UpdateOnePriceTableUsecase);
