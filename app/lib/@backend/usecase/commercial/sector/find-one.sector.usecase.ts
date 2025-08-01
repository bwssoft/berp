import { singleton } from "@/app/lib/util/singleton";
import { type Filter } from "mongodb";
import { RemoveMongoId } from "@/app/lib/@backend/decorators";
import { ISector, ISectorRepository } from "@/app/lib/@backend/domain";
import { sectorRepository } from "@/app/lib/@backend/infra/repository";

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
