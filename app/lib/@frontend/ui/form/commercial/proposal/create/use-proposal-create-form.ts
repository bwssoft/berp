import { createOneClientProposal } from '@/app/lib/@backend/action';
import { Currency, FreightType, IClient } from '@/app/lib/@backend/domain';
import { OmieEnterpriseEnum } from '@/app/lib/@backend/domain/@shared/gateway/omie.gateway.interface';
import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const CurrencyEnum = z.nativeEnum(Currency);
const FreightTypeEnum = z.nativeEnum(FreightType);

const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string(),
});

const LineItemSchema = z.object({
  id: z.string(),
  negotiation_type_id: z.string(),
  product_id: z.string(),
  quantity: z.coerce.number().nonnegative(),
  unit_price: z.coerce.number().nonnegative(),
  discount: z.coerce.number().nonnegative(),
  total_price: z.coerce.number().nonnegative(),
});

const ScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  currency: CurrencyEnum,
  description: z.string().optional(),
  product_total: z.coerce.number().nonnegative(),
  subtotal_with_discount: z.coerce.number().nonnegative(),
  discount_value: z.coerce.number().nonnegative(),
  grand_total: z.coerce.number().nonnegative(),
  freight: z
    .object({
      value: z.coerce.number().nonnegative(),
      type: FreightTypeEnum,
    })
    .optional(),
  line_items: z.array(LineItemSchema),
});

const BillingProcessSchema = z.object({
  id: z.string(),
  line_item_id: z.array(z.string()),
  omie_enterprise: z.custom<OmieEnterpriseEnum>(),
  installment_quantity: z.number().int().positive(),
  omie_sale_order_id: z.string().optional(),
});

const SignatureProcessSchema = z.object({
  id: z.string(),
  document_id: z.array(z.string()),
  contact: z.array(z.object({
    id: z.string(),
    signed: z.boolean(),
    seen: z.boolean(),
    sent: z.boolean(),
    requested: z.boolean(),
  }))
});

export const schema = z.object({
  description: z.string().optional(),
  billing_address: AddressSchema.optional(),
  delivery_address: AddressSchema.optional(),
  scenarios: z.array(ScenarioSchema).default([]),
  client_id: z.string().min(1),
  billing_process: z.record(z.string(), z.array(BillingProcessSchema)).optional(),
  signature_process: z.record(z.string(), SignatureProcessSchema).optional(),
  documents: z.array(z.any()).default([])
})

type Schema = z.infer<typeof schema>;

export { type Schema as ClientProposalSchema }

export function useClientProposalCreateForm() {
  const {
    register,
    unregister,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    control,
    setValue,
    reset: hookFormReset,
    getValues
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  // Gerencia apenas o array principal de scenarios
  const {
    fields: scenarios,
    append: appendScenario,
    remove: removeScenario,
  } = useFieldArray({
    control,
    name: 'scenarios',
  });

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      await createOneClientProposal(data);
      toast({
        title: 'Sucesso!',
        description: 'Proposta registrada com sucesso!',
        variant: 'success',
      });
    } catch (e) {
      toast({
        title: 'Erro!',
        description: 'Falha ao registrar a oportunidade!',
        variant: 'error',
      });
    }
  });

  const handleChangeClient = (client: IClient) => {
    setValue("billing_address.city", client.address?.city ?? "")
    setValue("billing_address.street", client.address?.street ?? "")
    setValue("billing_address.postal_code", client.address?.postal_code ?? "")
    setValue("billing_address.state", client.address?.state ?? "")
    setValue("billing_address.country", client.address?.country ?? "")
  }

  return {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    reset: hookFormReset,
    scenarios,
    appendScenario,
    removeScenario,
    unregister,
    getValues,
    handleChangeClient
  };
}
