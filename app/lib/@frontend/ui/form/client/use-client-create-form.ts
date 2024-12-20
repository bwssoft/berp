import { toast } from '@/app/lib/@frontend/hook/use-toast';
import { createOneClient } from '@/app/lib/@backend/action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  trade_name: z.string(),
  company_name: z.string(),
  document: z.object({
    type: z.enum(["CNPJ", "CPF"]).default("CNPJ"),
    value: z.string()
  }),
  tax_details: z.object({
    state_registration: z.string(),
    municipal_registration: z.string(),
  }),
  description: z.string(),
  address: z.object({
    state: z.string(),
    country: z.string(),
    street: z.string(),
    city: z.string(),
    postal_code: z.string()
  }),
  contacts: z.array(z.object({
    id: z.string(),
    labels: z.record(z.string(), z.string()),
    phone: z.record(z.string(), z.string()),
    email: z.record(z.string(), z.string()),
    name: z.string(),
    can_sign_contract: z.boolean().default(false),
    created_at: z.coerce.date()
  }))
});

export type Schema = z.infer<typeof schema>;

export function useClientCreateForm() {
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

  const { fields: contacts, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const handleAppendContact = append
  const handleRemoveContact = remove

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      await createOneClient(data);
      toast({
        title: "Sucesso!",
        description: "Cliente registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Erro!",
        description: "Falha ao registrar o cliente!",
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
    contacts,
    handleAppendContact,
    handleRemoveContact
  };
}
