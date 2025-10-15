import { singleton } from "@/app/lib/util/singleton";
import type { IProductionProcess } from "@/backend/domain/production/entity/production-process.definition";
import type { IProductionProcessRepository } from "@/backend/domain/production/repository/production-process.repository";
import { BaseRepository } from "../@base";

class ProductionProcessRepository
  extends BaseRepository<IProductionProcess>
  implements IProductionProcessRepository
{
  constructor() {
    super({
      collection: "production-process",
      db: "berp",
    });
  }
}

export const productionProcessRepository = singleton(ProductionProcessRepository);
