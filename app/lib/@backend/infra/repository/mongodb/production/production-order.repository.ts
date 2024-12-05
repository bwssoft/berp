import {
  IProductionOrder,
  IProductionOrderProcess,
  IProductionOrderRepository,
} from "@/app/lib/@backend/domain";
import { singleton } from "@/app/lib/util/singleton";
import { UpdateResult } from "mongodb";
import { BaseRepository } from "../@base";
import { productionProcessRepository } from "./production-process.repository";

class ProductionOrderRepository
  extends BaseRepository<IProductionOrder>
  implements IProductionOrderRepository {
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

    if (!production_order) {
      throw new Error("Production order not found");
    }

    const current_process = production_order?.production_process || [];

    const production_process = await productionProcessRepository.findAll({
      id: {
        $in: Array.isArray(value.process_uuid)
          ? value.process_uuid
          : [value.process_uuid],
      },
    });

    production_process.forEach((process) => {
      const processExists = this.checkIfProcessAlreadyExists(
        current_process,
        process.id
      );

      if (!processExists) {
        current_process.push({
          process_uuid: process.id,
          steps_progress: process.steps.map((step) => ({
            ...step,
            checked: false,
          })),
        });

        return;
      }
    });

    const entityUpdated = await this.updateOne(query, {
      $set: {
        production_process: current_process,
      }
    });

    return entityUpdated;
  }

  private checkIfProcessAlreadyExists(
    current_process: Array<IProductionOrderProcess>,
    process_uuid: string
  ) {
    return current_process.find(
      (process) => process.process_uuid === process_uuid
    );
  }
}

export const productionOrderRepository = singleton(ProductionOrderRepository);
