import {
  IProductionOrderLegacy,
  IProductionOrderRepository,
  IProductionOrderStep,
  IProductionProcess,
  IProductionProcessRepository,
  IProductionProcessStep,
} from "@/app/lib/@backend/domain";
import {
  productionOrderRepository,
  productionProcessRepository,
} from "@/app/lib/@backend/infra";
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
    const result = await this.repository.updateOne(query, { $set: value })

    if (result.modifiedCount > 0 && value.steps) {
      const productionOrdersWithThisProductionProcess =
        (await this.productionOrderRepository.findMany({
          "production_process.process_uuid": {
            $in: [query.id],
          },
        })) as unknown as IProductionOrderLegacy[];

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
              }
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
