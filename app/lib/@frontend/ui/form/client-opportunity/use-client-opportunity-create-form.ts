import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createOneClientOpportunity } from '@/app/lib/@backend/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string(),
  client_id: z.string(),
  initial_supply_date: z.coerce.date(),
  expected_closure_date: z.coerce.date(),
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

export function useClientOpportunityCreateForm() {
  const {
    register,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const { fields: productsOnForm, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const handleAppendProduct = append
  const handleRemoveProduct = remove

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createOneClientOpportunity(data);
      toast({
        title: "Sucesso!",
        description: "Oportunidade registrada com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar a oportunidade!",
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
