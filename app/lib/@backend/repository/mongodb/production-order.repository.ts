import { singleton } from "@/app/lib/util/singleton";
import {
    IProduct,
    IProductionOrder,
    IProductionOrderProcess,
    IProductionOrderRepository,
} from "@/app/lib/@backend/domain";
import { BaseRepository } from "./@base/base";
import { productionProcessRepository } from "./production-process.repository";
import { UpdateResult } from "mongodb";

class ProductionOrderRepository
    extends BaseRepository<IProductionOrder>
    implements IProductionOrderRepository
{
    constructor() {
        super({
            collection: "production-order",
            db: "berp",
        });
    }

    public async linkProductionProcess(
        query: Pick<IProductionOrder, "id">,
        value: { process_uuid: string | Array<string> }
    ): Promise<UpdateResult<IProductionOrder>> {
      const production_order = await this.findOne(query);

      if(!production_order) {
        throw new Error("Production order not found");
      }
      
      const current_process = production_order?.production_process || [];

      const production_process = await productionProcessRepository.findAll({
        id: { $in: Array.isArray(value.process_uuid) ? value.process_uuid : [value.process_uuid] }
      });

      production_process.forEach((process) => {
        const processExists = this.checkAlreadyExistsProcess(current_process, process.id);
        if (!processExists) {
          current_process.push({
            process_uuid: process.id,
            steps_progress: process.steps
          });
          return;
        }
      });

      const entityUpdated = await this.updateOne(query, {
        production_process: current_process
      });

      return entityUpdated;
    }

    private checkAlreadyExistsProcess(
        current_process: Array<IProductionOrderProcess>,
        process_uuid: string
    ) {
        return current_process.find((process) => process.process_uuid === process_uuid);
    }
}

export const productionOrderRepository = singleton(ProductionOrderRepository);
