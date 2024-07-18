import { toast } from '@/app/@lib/frontend/hook/use-toast';
import { updateOneClientOpportunityById } from '@/app/@lib/backend/action';
import { IClientOpportunity } from '@/app/@lib/backend/domain';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  client_id: z.string(),
  initial_supply_date: z.coerce.string(),
  expected_closure_date: z.coerce.string(),
  value: z.coerce.number(),
  products: z.array(z.object({ product_id: z.string(), quantity: z.coerce.number() })),
  type: z.enum(["existing_business", "new_business"]),
  sales_stage: z.enum(["initial_contact",
    "under_review",
    "proposal_sent",
    "in_negotiation",
    "sale_won",
    "sale_lost",
    "stopped"]),
  recurrence_type: z.enum(["monthly",
    "annual",
    "one_time_sale"]),
  probability: z.coerce.number(),
  description: z.string()
});

export type Schema = z.infer<typeof schema>;

interface Props {
  defaultValues: IClientOpportunity
}
export function useClientOpportunityUpdateForm(props: Props) {
  const { defaultValues } = props
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
      ...defaultValues,
      initial_supply_date: defaultValues.initial_supply_date.toISOString().split("T")[0],
      expected_closure_date: defaultValues.expected_closure_date.toISOString().split("T")[0],
    }
  });
  console.log(defaultValues.initial_supply_date,
    defaultValues.expected_closure_date)
  const { fields: productsOnForm, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const handleAppendProduct = append
  const handleRemoveProduct = remove

  useEffect(() => console.log(errors), [errors])

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      console.log(data)
      await updateOneClientOpportunityById({ id: defaultValues.id! }, { ...data, initial_supply_date: new Date(data.initial_supply_date), expected_closure_date: new Date(data.expected_closure_date) });
      toast({
        title: "Sucesso!",
        description: "Oportunidade atualizada com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar a oportunidade!",
        variant: "error",
      });
    }
  });

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    productsOnForm,
    handleAppendProduct,
    handleRemoveProduct
  };
}
