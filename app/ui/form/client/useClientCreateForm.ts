import { toast } from '@/app/hook/use-toast';
import { createOneClient } from '@/app/lib/action/client/client.action';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  type: z.enum([
    "prospect",
    "inactive_registration",
    "active_client",
    "suspended_client",
    "deregistered_cnpj",
    "inactive_cnpj",
    "dealer",
    "other"
  ]),
  sector: z.enum([
    "vehicle_protection_association",
    "retail_trade",
    "tracking_company",
    "service_company",
    "vehicle_protection_manager",
    "industry",
    "integrator_ti",
    "rental_company",
    "logistics",
    "iot_tracking_platform",
    "resale",
    "insurance_company",
    "patrimonial_security",
    "carrier",
    "other",
  ]),
  corporate_name: z.string(),
  document: z.string(),
  state_registration: z.string(),
  municipal_registration: z.string(),
  description: z.string(),
  billing_address: z.object({
    state: z.string(),
    country: z.string(),
    street: z.string(),
    city: z.string(),
    postal_code: z.string()
  }),
  contacts: z.array(z.object({
    phone: z.string(),
    name: z.string(),
    role: z.enum([
      "analyst",
      "supervisor",
      "manager",
      "director",
      "president",
      "owner",
    ]),
    department: z.enum([
      "administrative",
      "commercial",
      "purchasing",
      "financial",
      "logistics",
      "operations",
      "presidency",
      "products",
      "owner",
      "support"
    ]),
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

  useEffect(() => console.log(errors), [errors])

  const handleSubmit = hookFormSubmit(async (data) => {
    try {
      //fazer a request
      console.log(data)
      await createOneClient(data);
      toast({
        title: "Sucesso!",
        description: "Cliente registrado com sucesso!",
        variant: "success",
      });
    } catch (e) {
      console.log(e)
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
