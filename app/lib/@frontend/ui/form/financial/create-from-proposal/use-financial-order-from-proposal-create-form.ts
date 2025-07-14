import { updateOneFinancialOrderFromProposal } from "@/app/lib/@backend/action/financial/financial-order.action";
import { IFinancialOrder } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { error } from "console";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
  defaultValues?: IFinancialOrder;
  proposal_id: string;
}

const line_items_processed = z.object({
  enterprise_id: z.string(),
  negotiation_type_id: z.string(),
  enterprise: z.any(),
  installment_quantity: z.coerce.number().nullable(),
  installment: z.array(z.any()).nullable(),
  items: z.array(z.any()),
  entry_amount: z.coerce.number().nullable(), // OBS: obrigado a usar nullable pela forma com a tipagem de defaultValues. Revisar uma forma melhor para fazer isso. 'entry_value' nesse form é obrigatório mas na entidade de IFinancialOrder não.
});

export const schema = z.object({
  line_items_processed: z.array(line_items_processed),
});

type Schema = z.infer<typeof schema>;

export function useFinancialOrderCreateFromProposal(props: Props) {
  const { defaultValues, proposal_id } = props;
  const {
    register,
    handleSubmit: hookFormSubmit,
    reset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      data.line_items_processed.forEach((l) => {
        delete l.enterprise;
        l.items.forEach((i) => {
          delete i.product;
        });
      });
      await updateOneFinancialOrderFromProposal(
        { id: defaultValues?.id! },
        data,
        proposal_id
      );
      toast({
        title: "Sucesso!",
        description: "Pedido de venda atualizado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar o Pedido de venda!",
        variant: "error",
      });
    }
  });

  useEffect(() => reset(defaultValues), [defaultValues, reset]);

  return { handleSubmit, register };
}
