import { singleton } from "@/app/lib/util/singleton";
import IProductionProcess from "@/app/lib/@backend/domain/production/entity/production-process.definition";
import IProductionProcessRepository from "@/app/lib/@backend/domain/production/repository/production-process.repository.interface";
import { BaseRepository } from "../@base";

class ProductionProcessRepository
    extends BaseRepository<IProductionProcess>
    implements IProductionProcessRepository {
    constructor() {
        super({
            collection: "production-process",
            db: "berp",
        });
    }
}

export const productionProcessRepository = singleton(ProductionProcessRepository);
