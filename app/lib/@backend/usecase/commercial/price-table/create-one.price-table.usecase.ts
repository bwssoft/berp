import { singleton } from "@/app/lib/util/singleton";
import {
  AuditDomain,
  IPriceTable,
  IPriceTableRepository,
} from "../../../domain";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";
import { priceTableRepository } from "../../../infra/repository/mongodb/commercial/price-table.repository";
import { normalizeString } from "@/app/lib/util/normalize-string";
import { findManyPriceTableUsecase } from "./find-many.price-table.usecase";

namespace Dto {
  export type Input = Omit<IPriceTable, "id" | "created_at" | "updated_at">;
  export type Output = {
    success: boolean;
    id?: string;
    error?: {
      global?: string;
      name?: string;
      startDateTime?: string;
      endDateTime?: string;
    };
  };
}

class CreateOnePriceTableUsecase {
  repository: IPriceTableRepository = priceTableRepository;

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const now = new Date();

      // (talvez eu adicione essas validações no form do front tbm, mas to mantendo aq pra garantir)
      if (input.startDateTime < now) {
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

      // --- unicidade de nome (CI)
      const { docs } = await findManyPriceTableUsecase.execute({});
      const normalizedInputName = normalizeString(input.name?.trim() ?? "");
      const duplicated = docs.find(
        (t) => normalizeString(t.name) === normalizedInputName
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

      const nowIso = new Date();
      const name = input.name?.trim();
      const priceTable: IPriceTable = {
        id: crypto.randomUUID(),
        name: name ?? "",
        startDateTime: input.startDateTime,
        endDateTime: input.endDateTime ?? input.startDateTime,
        isTemporary: input.isTemporary,
        conditionGroupIds: input.conditionGroupIds ?? [],
        enabledProductsIds: input.enabledProductsIds ?? [],
        status: input.status ?? "DRAFT",
        equipmentPayment: input.equipmentPayment ?? [],
        simcardPayment: input.simcardPayment ?? [],
        servicePayment: input.servicePayment ?? [],
        created_at: nowIso,
        updated_at: nowIso,
      };

      await this.repository.create(priceTable);

      // --- auditoria
      const session = await auth();
      if (session?.user) {
        const { name: userName, email, id: user_id } = session.user;
        await createOneAuditUsecase.execute({
          after: priceTable,
          before: {},
          domain: AuditDomain.priceTable,
          user: { email, name: userName, id: user_id },
          action: `Tabela de preços '${priceTable.name}' cadastrada.`,
        });
      }

      return { success: true, id: priceTable.id };
    } catch (err: any) {
      console.error("Falha ao criar Tabela de Preços:", err);
      return {
        success: false,
        error: { global: "Falha ao criar Tabela de Preços." },
      };
    }
  }
}

export const createOnePriceTableUsecase = singleton(CreateOnePriceTableUsecase);
