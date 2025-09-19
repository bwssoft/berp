import { singleton } from "@/app/lib/util/singleton";
import {
  AuditDomain,
  IPriceTable,
  IPriceTableRepository,
} from "@/app/lib/@backend/domain";
import { auth } from "@/auth";
import { createOneAuditUsecase } from "../../admin/audit";
import { priceTableRepository } from "../../../infra/repository/mongodb/commercial/price-table.repository";

namespace Dto {
  export type Input = { id: string };
  export type Output = {
    success: boolean;
    error?: { global?: string };
  };
}

class InactivatePriceTableUsecase {
  repository: IPriceTableRepository = priceTableRepository;

  async execute(input: Dto.Input): Promise<Dto.Output> {
    try {
      const current = await this.repository.findOne({ id: input.id });
      if (!current) {
        return { success: false, error: { global: "Tabela de preços não encontrada." } };
      }

      if (current.status === "INACTIVE") {
        return { success: true };
      }

      const now = new Date();

      // 3) Se for PROVISÓRIA: ao inativar, reativar NORMAL que estiver PAUSED (se houver)
      if (current.isTemporary) {
        // Atualiza a provisória para INACTIVE
        const updatedProv = await this.repository.updateOne(
          { id: input.id },
          { $set: { status: "INACTIVE", updated_at: now } }
        );

        if (!updatedProv) {
          return {
            success: false,
            error: { global: "Falha ao inativar tabela provisória." },
          };
        }

        // Reativar NORMAL PAUSED (no singular; se houver mais de uma, reativa todas por consistência)
        const pausedNormals = await this.repository.findMany({
          id: { $ne: input.id },
          isTemporary: false,
          status: "PAUSED",
        });

        for (const t of pausedNormals.docs) {
          await this.repository.updateOne(
            { id: t.id! },
            { $set: { status: "ACTIVE", updated_at: now } }
          );
        }

      } else {
        // 4) Se for NORMAL: apenas marcar como INACTIVE
        const updatedNorm = await this.repository.updateOne(
          { id: input.id },
          { $set: { status: "INACTIVE", updated_at: now } }
        );

        if (!updatedNorm) {
          return {
            success: false,
            error: { global: "Falha ao inativar tabela." },
          };
        }
      }

      // 5) Auditoria
      const after = await this.repository.findOne({ id: input.id });
      if (!after) {
        return {
          success: false,
          error: { global: "Tabela não encontrada após atualização." },
        };
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

export const inactivatePriceTableUsecase = singleton(InactivatePriceTableUsecase);