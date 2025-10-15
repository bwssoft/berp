import { createOneProductionProcess } from "@/backend/action/production/production-process.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

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

export function useProductionProcessCreateForm() {
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
      attachments: [],
      steps: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "steps",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await createOneProductionProcess({ ...data });
      toast({
        title: "Sucesso!",
        description: "Processo de produção registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar processo de produção!",
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

