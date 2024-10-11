import { updateOneProductionProcessById } from "@/app/lib/@backend/action";
import { IProductionProcess } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

type UseProductionProcessUpdateFormParams = {
  productionProcess: IProductionProcess;
};

const schema = z.object({
  name: z.string({ required_error: "Nome não pode ser vazio" }),
  steps: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    })
  ),
  attachments: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      url: z.string(),
      extension: z.string(),
    })
  ),
});

export type Schema = z.infer<typeof schema>;

export function useProductionProcessUpdateForm({
  productionProcess,
}: UseProductionProcessUpdateFormParams) {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      attachments: productionProcess.attachments,
      steps: productionProcess.steps,
      name: productionProcess.name,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "steps",
    keyName: "key",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      // removes field array key
      const mappedSteps = data.steps.map(({ id, label }) => ({ id, label }));

      await updateOneProductionProcessById(
        { id: productionProcess.id },
        { ...data, steps: mappedSteps }
      );

      toast({
        title: "Sucesso!",
        description: "Processo de produção alterado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao alterar processo de produção!",
        variant: "error",
      });
    }
  });

  const handleAppendStep = () => {
    append({
      id: crypto.randomUUID(),
      label: "Etapa",
    });
  };

  const handleRemoveStep = (stepIndex: number) => {
    remove(stepIndex);
  };

  const handleStepLabelEdit = (params: {
    label: string;
    stepIndex: number;
  }) => {
    update(params.stepIndex, {
      ...fields[params.stepIndex],
      label: params.label,
    });
  };

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    steps: fields,
    handleAppendStep,
    handleRemoveStep,
    handleStepLabelEdit,
  };
}
