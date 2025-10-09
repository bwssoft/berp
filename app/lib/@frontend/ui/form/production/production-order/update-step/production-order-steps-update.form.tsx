"use client";

import {IProductionOrderLegacy} from "@/backend/domain/production/entity/production-order.definition";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { Checkbox } from "@/app/lib/@frontend/ui/component/checkbox";
import { useProductionOrderStepsUpdateForm } from "./use-production-order-steps-update-form";

type ProductionProcessStepsUpdateFormProps = {
  productionOrder: IProductionOrderLegacy;
};

export function ProductionOrderStepsUpdateForm({
  productionOrder,
}: ProductionProcessStepsUpdateFormProps) {
  const { watch, handleCheckboxChange, handleSubmit } =
    useProductionOrderStepsUpdateForm({
      productionOrder,
    });

  return (
    <form className="w-full space-y-2" action={() => handleSubmit()}>
      <div className="flex flex-col gap-1 p-1">
        {watch("steps")?.map((step) => (
          <Checkbox
            key={step.id}
            checked={step.checked}
            name={step.label}
            label={step.label}
            onChange={(event) =>
              handleCheckboxChange(step.id, event.target.checked)
            }
          />
        ))}
      </div>

      <Button type="submit" variant="outline">
        Atualizar etapas
      </Button>
    </form>
  );
}

