// app/lib/@backend/usecase/commercial/sector/create-one-sector.usecase.ts
import { singleton } from "@/app/lib/util/singleton";
import { ISector, ISectorRepository } from "@/app/lib/@backend/domain";
import { sectorRepository } from "../../../infra/repository";

class CreateOneSectorUsecase {
    repository: ISectorRepository;

    constructor() {
        this.repository = sectorRepository;
    }

    async execute(
        input: Omit<ISector, "id" | "created_at" | "updated_at">
    ): Promise<ISector> {
        const sector: ISector = {
            ...input,
            id: crypto.randomUUID(),
            active: true,
            created_at: new Date(),
        };
        await this.repository.create(sector);

        return sector;
    }
}

export const createOneSectorUsecase = singleton(CreateOneSectorUsecase);
