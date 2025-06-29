import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { IProductionOrder } from "@/app/lib/@backend/domain";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  priority: z.enum(["high", "medium", "low"]),
  stage: z.enum([
    "to_produce",
    "producing",
    "quality",
    "checked",
    "completed",
    "stored",
  ]),
  description: z.string().min(1, "Esse campo não pode ser vazio"),
  files: z.any(),
  products: z.array(
    z.object({ product_id: z.string(), quantity: z.coerce.number() })
  ),
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IProductionOrder;
}

export function useProductionOrderUpdateForm(props: Props) {
  const { defaultValues } = props;
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    // //defaultValues
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      // await updateOneProductionOrderById({ id: defaultValues.id! }, data);
      toast({
        title: "Sucesso!",
        description: "Order de produção atualizada com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar a ordem de produção!",
        variant: "error",
      });
    }
  });

  const handleAppendProduct = append;
  const handleRemoveProduct = remove;

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    productsOnForm: fields,
    handleAppendProduct,
    handleRemoveProduct,
  };
}
