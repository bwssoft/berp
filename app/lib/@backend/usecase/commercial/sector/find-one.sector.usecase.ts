import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/backend/decorators";
import { ISector } from "@/backend/domain/commercial/entity/sector.definition";
import { ISectorRepository } from "@/backend/domain/commercial/repository/sector.repository";
import { sectorRepository } from "@/backend/infra";

class FindOneSectorUsecase {
    repository: ISectorRepository;

    constructor() {
        this.repository = sectorRepository;
    }

    @RemoveMongoId()
    async execute(input: Filter<ISector>) {
        return await this.repository.findOne(input);
    }
}

export const findOneSectorUsecase = singleton(FindOneSectorUsecase);

