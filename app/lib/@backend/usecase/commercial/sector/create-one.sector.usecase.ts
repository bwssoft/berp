import { singleton } from "@/app/lib/util/singleton";
import { ISector, ISectorRepository } from "@/app/lib/@backend/domain";
import { sectorRepository } from "../../../infra/repository";

class CreateOneSectorUsecase {
    repository: ISectorRepository;

    constructor() {
        this.repository = sectorRepository;
    }

    async execute(input: Omit<ISector, "id" | "created_at" | "updated_at">) {
        const sector = {
            ...input,
            id: crypto.randomUUID(),
            created_at: new Date(),
        };
        return await this.repository.create(sector);
    }
}

export const createOneSectorUsecase = singleton(CreateOneSectorUsecase);
