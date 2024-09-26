import { updateOneProductionOrderById } from "@/app/lib/@backend/action";
import { IProductionOrder } from "@/app/lib/@backend/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../../../hook";

type UseProductionOrderStepsUpdateFormParams = {
  productionOrder: IProductionOrder;
};

const stepsSchema = z.object({
  steps: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      checked: z.boolean(),
    })
  ),
});

type StepsSchemaFormData = z.infer<typeof stepsSchema>;

export function useProductionOrderStepsUpdateForm({
  productionOrder,
}: UseProductionOrderStepsUpdateFormParams) {
  const {
    getValues,
    setValue,
    watch,
    handleSubmit: hookFormSubmit,
  } = useForm<StepsSchemaFormData>({
    resolver: zodResolver(stepsSchema),
  });

  useEffect(() => {
    if (!productionOrder.production_process) return;

    setValue("steps", productionOrder.production_process[0].steps_progress);
  }, [productionOrder]);

  function handleCheckboxChange(stepId: string, checked: boolean) {
    const currentStepsValue = getValues("steps");

    const changedStepIndex = currentStepsValue.findIndex(
      ({ id }) => id === stepId
    );

    currentStepsValue[changedStepIndex]["checked"] = checked;

    setValue("steps", currentStepsValue);
  }

  const handleSubmit = hookFormSubmit(async (data) => {
    const updatedSteps = data.steps;

    const updatedProcessData = [
      {
        process_uuid: productionOrder.production_process![0].process_uuid,
        steps_progress: updatedSteps,
      },
    ];

    try {
      await updateOneProductionOrderById(
        { id: productionOrder.id },
        { production_process: updatedProcessData }
      );

      toast({
        title: "Sucesso!",
        description: "Etapas da ordem de produção atualizadas com sucesso",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro!",
        description:
          "Ocorreu um erro ao atualizar as etapas da ordem de produção",
        variant: "error",
      });
    }
  });

  return {
    handleCheckboxChange,
    watch,
    handleSubmit,
  };
}
