import type {
  IProductionOrderLegacy,
  IProductionOrderStep,
} from "@/backend/domain/production/entity/production-order.definition";
import type {
  IProductionProcess,
  IProductionProcessStep,
} from "@/backend/domain/production/entity/production-process.definition";
import type { IProductionOrderRepository } from "@/backend/domain/production/repository/production-order.repository";
import type { IProductionProcessRepository } from "@/backend/domain/production/repository/production-process.repository";
import {
  productionOrderRepository,
  productionProcessRepository,
} from "@/backend/infra";
import { singleton } from "@/app/lib/util/singleton";

class UpdateOneProductionProcessUsecase {
  repository: IProductionProcessRepository;
  productionOrderRepository: IProductionOrderRepository;

  constructor() {
    this.repository = productionProcessRepository;
    this.productionOrderRepository = productionOrderRepository;
  }

  private mergeSteps(params: {
    currentSteps: IProductionOrderStep[];
    newSteps: IProductionProcessStep[];
  }) {
    const currentSteps = [...params.currentSteps];
    const newSteps = [...params.newSteps];

    newSteps.forEach((step) => {
      const stepObject = currentSteps.find(({ id }) => id === step.id);
      const stepObjectIndex = currentSteps.findIndex(
        ({ id }) => id === step.id
      );
      const stepAlreadyExists = stepObject !== undefined;

      if (stepAlreadyExists) {
        const updatedStep: IProductionOrderStep = {
          ...stepObject,
          label: step.label,
        };

        currentSteps.splice(stepObjectIndex, 1, updatedStep);
      } else {
        const newStep: IProductionOrderStep = {
          ...step,
          checked: false,
        };

        currentSteps.push(newStep);
      }
    });

    return currentSteps;
  }

  async execute(
    query: { id: string },
    value: Partial<Omit<IProductionProcess, "id" | "created_at">>
  ) {
    const result = await this.repository.updateOne(query, { $set: value });

    if (result.modifiedCount > 0 && value.steps) {
      const { docs: productionOrdersWithThisProductionProcess } =
        (await this.productionOrderRepository.findMany({
          "production_process.process_uuid": {
            $in: [query.id],
          },
        })) as unknown as { docs: IProductionOrderLegacy[] }

      await Promise.all(
        productionOrdersWithThisProductionProcess.map((productionOrder) => {
          return productionOrderRepository.updateOne(
            { id: productionOrder.id },
            {
              $set: {
                production_process: [
                  {
                    process_uuid: query.id,
                    steps_progress: this.mergeSteps({
                      currentSteps:
                        productionOrder.production_process![0].steps_progress,
                      newSteps: value.steps!,
                    }),
                  },
                ],
              },
            }
          );
        })
      );
    }
  }
}

export const updateOneProductionProcessUsecase = singleton(
  UpdateOneProductionProcessUsecase
);


