import type { Filter } from "mongodb";

import { sectorRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { ISector, ISectorRepository } from "@/app/lib/@backend/domain";

class UpdateOneSectorUsecase {
    repository: ISectorRepository;

    constructor() {
        this.repository = sectorRepository;
    }

    @RemoveMongoId()
    async execute(filter: Filter<ISector>, update: Partial<ISector>) {
        return await this.repository.updateOne(filter, { $set: update });
    }
}

export const updateOneSectorUsecase = singleton(UpdateOneSectorUsecase);
