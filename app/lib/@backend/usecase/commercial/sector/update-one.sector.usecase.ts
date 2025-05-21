import type { Filter } from "mongodb";

import { sectorRepository } from "@/app/lib/@backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { ISector, ISectorRepository } from "@/app/lib/@backend/domain";

class UpdateOneAccountUsecase {
    repository: ISectorRepository;

    constructor() {
        this.repository = sectorRepository;
    }

    @RemoveMongoId()
    async execute(filter: Filter<ISector>, update: Partial<ISector>) {
        return await this.repository.updateOne(filter, update);
    }
}

export const updateOneAccountUsecase = singleton(UpdateOneAccountUsecase);
