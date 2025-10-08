"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { isValidCEP } from "@/app/lib/util/is-valid-cep";
import { IAddress } from "@/app/lib/@backend/domain";
import { viaCepGateway } from "@/app/lib/@backend/infra/gateway/viacep/viacep.gateway";
import { formatCep } from "@/app/lib/util/format-cep";
import { LocalAddress } from '@/frontend/context/create-account-flow.context';


const AddressFormSchema = z.object({
  zip_code: z.string().min(8, "CEP obrigatório").refine(isValidCEP, {
    message: "CEP inválido.",
  }),
  street: z.string().min(1, "Logradouro obrigatório"),
  number: z
    .string()
    .min(1, "Número obrigatório")
    .refine((val) => /^\d+$/.test(val), {
      message: "Número deve conter apenas dígitos",
    }),
  complement: z.string().optional(),
  district: z.string().min(1, "Bairro obrigatório"),
  state: z.string().min(1, "Estado obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  reference_point: z.string().optional(),
  type: z
    .array(
      z.enum(["Comercial", "Entrega", "Faturamento", "Residencial", "Fiscal"])
    )
    .min(1, "Selecione pelo menos um tipo")
    .optional(),
  default_address: z.boolean().optional(),
});

export type AddressFormSchema = z.infer<typeof AddressFormSchema>;

interface Props {
  address: IAddress;
  onSubmit: (addressId: string, data: IAddress) => Promise<void>;
}

export function useAddressUpdateForm({ address, onSubmit }: Props) {
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepEdited, setCepEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit: hookFormSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AddressFormSchema>({
    resolver: zodResolver(AddressFormSchema),
    defaultValues: {
      zip_code: formatCep(address.zip_code ?? ""),
      street: address.street ?? "",
      number: address.number ?? "",
      complement: address.complement ?? "",
      district: address.district ?? "",
      state: address.state ?? "",
      city: address.city ?? "",
      reference_point: address.reference_point ?? "",
      type: Array.isArray(address.type)
        ? address.type
        : address.type
          ? [address.type]
          : [],
      default_address: address.default_address ?? false,
    },
  });

  const zip = useWatch({ control, name: "zip_code" });

  async function fetchViaCep(cep: string) {
    setLoadingCep(true);
    try {
      const data = await viaCepGateway.findByCep(cep);
      setValue("street", data.street, { shouldValidate: true });
      setValue("district", data.district, { shouldValidate: true });
      setValue("city", data.city, { shouldValidate: true });
      setValue("state", data.state, { shouldValidate: true });
      if (data.complement) setValue("complement", data.complement);
    } catch (e: any) {
      toast({ title: "Erro!", description: e.message, variant: "error" });
    } finally {
      setLoadingCep(false);
    }
  }

  useEffect(() => {
    const numericCep = zip.replace(/\D/g, "");
    if (cepEdited && isValidCEP(numericCep)) {
      fetchViaCep(numericCep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip]);

  const handleSubmit = hookFormSubmit(
    async (data) => {
      setIsSubmitting(true);

      await onSubmit(address.id || "", data);

      setIsSubmitting(false);
    },
    () => {}
  );

  const registerCep = () => {
    const registration = register("zip_code");
    return {
      ...registration,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formatted = formatCep(rawValue);
        setValue("zip_code", formatted, { shouldValidate: true });
        setCepEdited(true);
      },
    };
  };

  const registerNumber = () => {
    const registration = register("number");
    return {
      ...registration,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = e.target.value.replace(/\D/g, "");
        setValue("number", formatted, { shouldValidate: true });
      },
    };
  };

  return {
    register,
    registerCep,
    registerNumber,
    control,
    handleSubmit,
    errors,
    loadingCep,
    isSubmitting,
    setValue,
  };
}
