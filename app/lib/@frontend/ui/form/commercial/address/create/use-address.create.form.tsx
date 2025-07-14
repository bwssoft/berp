"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import { isValidCEP } from "@/app/lib/util/is-valid-cep";
import { useQueryClient } from "@tanstack/react-query";
import { addressesQueryKey } from "../get/useaddress";

import { createOneAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { viaCepGateway } from "@/app/lib/@backend/infra/gateway/viacep/viacep.gateway";
import { formatCep } from "@/app/lib/util/format-cep";

const AddressFormSchema = z.object({
  address_search: z.string().optional(),
  zip_code: z.string().min(8, "CEP obrigatório").refine(isValidCEP, {
    message: "CEP inválido.",
  }),
  street: z.string().min(1, "Logradouro obrigatório"),
  number: z.string().min(1, "Número obrigatório"),
  complement: z.string().optional(),
  district: z.string().min(1, "Bairro obrigatório"),
  state: z.string().min(1, "Estado obrigatório"),
  city: z.string().min(1, "Cidade obrigatória"),
  reference_point: z.string().optional(),
  type: z
    .array(z.enum(["Comercial", "Entrega", "Faturamento", "Residencial"]))
    .min(1, "Selecione pelo menos um tipo")
    .optional(),
});

export type AddressFormSchema = z.infer<typeof AddressFormSchema>;

export function useAddressForm({
  closeModal,
  accountId,
}: {
  closeModal: () => void;
  accountId: string;
}) {
  const queryClient = useQueryClient();
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
      address_search: "",
      zip_code: "",
      street: "",
      number: "",
      complement: "",
      district: "",
      state: "",
      city: "",
      reference_point: "",
      type: [],
    },
  });

  const zip = useWatch({ control, name: "zip_code" });
  const [loadingCep, setLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (isValidCEP(numericCep)) fetchViaCep(numericCep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip]);

  const handleSubmit = hookFormSubmit(
    async (data) => {
      setIsSubmitting(true);
      try {
        await createOneAddress({
          ...data,
          accountId,
          zip_code: data.zip_code.replace(/\D/g, ""),
        });
        toast({
          title: "Sucesso!",
          description: "Endereço criado com sucesso!",
          variant: "success",
        });
        // Invalidate and refetch addresses query
        await queryClient.invalidateQueries({
          queryKey: addressesQueryKey(accountId),
        });
        closeModal();
      } catch {
        toast({
          title: "Erro!",
          description: "Falha ao registrar o endereço!",
          variant: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    () => {}
  );

  return {
    register,
    control,
    handleSubmit,
    errors,
    loadingCep,
    formatCep,
    isSubmitting,
  };
}
