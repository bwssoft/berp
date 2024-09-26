"use client";

import { IProductionOrder } from "@/app/lib/@backend/domain";
import { Button } from "../../button";
import { Checkbox } from "../../checkbox";
import { useProductionOrderStepsUpdateForm } from "./use-production-order-steps-update-form";

type ProductionProcessStepsUpdateFormProps = {
  productionOrder: IProductionOrder;
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

      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500">
        Atualizar etapas
      </Button>
    </form>
  );
}
