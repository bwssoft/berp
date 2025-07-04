"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook";
import { isValidCEP } from "@/app/lib/util/is-valid-cep";
import { useRouter } from "next/navigation";
import { IAddress } from "@/app/lib/@backend/domain";
import { useQueryClient } from "@tanstack/react-query";
import { updateOneAddress } from "@/app/lib/@backend/action/commercial/address.action";

const AddressFormSchema = z.object({
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

interface Props {
  address: IAddress;
  closeModal: () => void;
}

export function useAddressUpdateForm({ address, closeModal }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepEdited, setCepEdited] = useState(false);

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
      zip_code: address.zip_code ?? "",
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
    },
  });

  const zip = useWatch({ control, name: "zip_code" });

  async function fetchViaCep(cep: string) {
    setLoadingCep(true);
    try {
      const res = await fetch(`/api/viacep?cep=${cep}`);
      if (!res.ok) throw new Error("CEP não encontrado");
      const data = await res.json();
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
    if (cepEdited && isValidCEP(zip)) fetchViaCep(zip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip]);

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        await updateOneAddress({ id: address.id }, data);
        toast({
          title: "Sucesso!",
          description: "Endereço atualizado com sucesso!",
          variant: "success",
        });
        await queryClient.invalidateQueries({
          queryKey: ["addresses"],
        });
        closeModal();
      } catch {
        toast({
          title: "Erro!",
          description: "Falha ao atualizar o endereço!",
          variant: "error",
        });
      }
    },
    () => {}
  );

  const registerCep = () => {
    const registration = register("zip_code");
    return {
      ...registration,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        registration.onChange(e);
        setCepEdited(true);
      },
    };
  };

  return {
    register,
    registerCep,
    control,
    handleSubmit,
    errors,
    loadingCep,
  };
}
