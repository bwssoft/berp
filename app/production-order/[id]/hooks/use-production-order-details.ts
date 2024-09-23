import {
  findAllProductionProcess,
  updateOneProductionOrderById,
} from "@/app/lib/@backend/action";
import {
  IProductionOrder,
  IProductionProcess,
} from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const productionOrderDetailsSchema = z.object({
  production_process: z.array(
    z.object({
      process_uuid: z.string(),
      steps_progress: z
        .array(
          z.object({
            id: z.string(),
            label: z.string(),
            checked: z.boolean(),
          })
        )
        .min(1),
    })
  ),
});

type ProductionOrderDetailsFormData = z.infer<
  typeof productionOrderDetailsSchema
>;

type UseProductionOrderDetailsParams = {
  productionOrder: IProductionOrder | null;
};

export function useProductionOrderDetails({
  productionOrder,
}: UseProductionOrderDetailsParams) {
  const [isEditingSelectedProcess, setIsEditingSelectedProcess] =
    useState<boolean>(false);

  const { handleSubmit: hookFormSubmit, setValue } =
    useForm<ProductionOrderDetailsFormData>({
      resolver: zodResolver(productionOrderDetailsSchema),
    });

  const findAllProductionProcesses = useQuery({
    queryKey: ["findAllProductionProcesses"],
    queryFn: () => findAllProductionProcess(),
  });

  function onProductionProcessChange(productionProcess?: IProductionProcess) {
    if (!productionProcess) {
      setValue("production_process", []);
      return;
    }

    const formattedProductionProcess: IProductionOrder["production_process"] = [
      {
        process_uuid: productionProcess.id,
        steps_progress: productionProcess.steps.map((step) => ({
          id: step.id,
          checked: false,
          label: step.label,
        })),
      },
    ];

    setValue("production_process", formattedProductionProcess);
  }

  const handleSubmit = hookFormSubmit(async (data) => {
    if (!productionOrder) return;

    const productionProcessData = data.production_process;

    try {
      await updateOneProductionOrderById(
        { id: productionOrder.id },
        { production_process: productionProcessData }
      );

      toast({
        title: "Sucesso!",
        description: "Ordem de produção atualizada com sucesso",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro!",
        description: "Ocorreu um erro ao atualizar a ordem de produção",
        variant: "error",
      });
    }
  });

  return {
    findAllProductionProcesses,
    handleSubmit,
    onProductionProcessChange,
    isEditingSelectedProcess,
    setIsEditingSelectedProcess,
  };
}
