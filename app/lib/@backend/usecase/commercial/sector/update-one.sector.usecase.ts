import type { Filter } from "mongodb";

import { sectorRepository } from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";
import { RemoveMongoId } from "@/backend/decorators";
import { ISector } from "@/backend/domain/commercial/entity/sector.definition";
import { ISectorRepository } from "@/backend/domain/commercial/repository/sector.repository";

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

