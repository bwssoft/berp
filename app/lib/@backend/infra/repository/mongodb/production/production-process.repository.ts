import { singleton } from "@/app/lib/util/singleton";
import {
    IProductionProcess,
    IProductionProcessRepository,
} from "@/app/lib/@backend/domain";
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
