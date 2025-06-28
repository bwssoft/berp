import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import type { Filter } from "mongodb";
import { ISectorRepository } from "@/app/lib/@backend/domain/commercial";
import { sectorRepository } from "@/app/lib/@backend/infra/repository";
import { ISector } from "@/app/lib/@backend/domain";

class FindManySectorUsecase {
    repository: ISectorRepository;

    constructor() {
        this.repository = sectorRepository;
    }

    @RemoveMongoId()
    async execute(input: Filter<ISector>) {
        const { docs } = await this.repository.findMany(input);
        return docs;
    }
}

export const findManySectorUsecase = singleton(FindManySectorUsecase);
