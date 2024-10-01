import {
  IProductionOrderRepository,
  IProductionProcess,
  IProductionProcessRepository,
} from "@/app/lib/@backend/domain";
import {
  productionOrderRepository,
  productionProcessRepository,
} from "@/app/lib/@backend/repository/mongodb";
import { singleton } from "@/app/lib/util/singleton";

class UpdateOneProductionProcessUsecase {
  repository: IProductionProcessRepository;
  productionOrderRepository: IProductionOrderRepository;

  constructor() {
    this.repository = productionProcessRepository;
    this.productionOrderRepository = productionOrderRepository;
  }

  async execute(
    query: { id: string },
    value: Partial<Omit<IProductionProcess, "id" | "created_at">>
  ) {
    const result = await this.repository.updateOne(query, value);

    const newSteps = value.steps;

    if (result.modifiedCount > 0 && value.steps) {
      const productionOrdersWithThisProductionProcess =
        await this.productionOrderRepository.findAll({
          "production_process.process_uuid": {
            $in: [query.id],
          },
        });

      const productionOrdersIds = productionOrdersWithThisProductionProcess.map(
        ({ id }) => id
      );

      productionOrderRepository.updateMany(
        { id: { $in: productionOrdersIds } },
        {
          production_process: [
            { process_uuid: query.id, steps_progress: newSteps! },
          ],
        }
      );
    }
  }
}

export const updateOneProductionProcessUsecase = singleton(
  UpdateOneProductionProcessUsecase
);
