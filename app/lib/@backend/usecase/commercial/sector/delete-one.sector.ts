import { singleton } from "@/app/lib/util/singleton";
import { ISector } from "@/backend/domain/commercial/entity/sector.definition";
import { ISectorRepository } from "@/backend/domain/commercial/repository/sector.repository";
import { sectorRepository } from "@/backend/infra";

export type DeleteSectorOutput = {
    success?: { deleted: boolean; sectorId: string };
    error?: { global: string };
};

class DeleteOneSectorUsecase {
    repository: ISectorRepository;

    constructor() {
        this.repository = sectorRepository;
    }

    async execute(input: Partial<ISector>): Promise<DeleteSectorOutput> {
        const sectorId = input.id;
        if (!sectorId) {
            return { error: { global: "ID do setor não informado." } };
        }

        try {
            await this.repository.deleteOne({ id: sectorId });
            return { success: { deleted: true, sectorId } };
        } catch (err) {
            console.error("Erro ao deletar setor:", err);
            return {
                error: { global: "Erro inesperado ao deletar o setor." },
            };
        }
    }
}

export const deleteOneSectorUsecase = singleton(DeleteOneSectorUsecase);

