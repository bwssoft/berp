"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/app/lib/@frontend/hook";
import { createOneAddress } from "@/app/lib/@backend/action";
import { isValidCEP } from "@/app/lib/util/is-valid-cep";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { addressesQueryKey } from "../get/useaddress";

import type { INominatimInterface } from "@/app/lib/@backend/domain/@shared/gateway/nominatim.gateway.interface";
import { nominatimGateway } from "@/app/lib/@backend/infra/gateway/nominatim/nominatim.gateway";

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
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [suggestions, setSuggestions] = useState<INominatimInterface[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length < 4) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setLoadingSearch(true);
        const res = await nominatimGateway.searchAddress(search);
        setSuggestions(res);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

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
    if (isValidCEP(zip)) fetchViaCep(zip);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zip]);

  function handleSelectSuggestion(item: INominatimInterface) {
    setValue("address_search", item.display_name);
    const { address } = item;
    if (address.postcode) setValue("zip_code", address.postcode);
    if (address.road) setValue("street", address.road);
    if (address.neighbourhood || address.suburb)
      setValue("district", address.neighbourhood ?? address.suburb ?? "");
    if (address.city || address.town)
      setValue("city", address.city ?? address.town ?? "");
    if (address.state) setValue("state", address.state);
  }

  const handleSubmit = hookFormSubmit(
    async (data) => {
      try {
        await createOneAddress({
          ...data,
          accountId,
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
    loadingSearch,
    suggestions,
    setSearch,
    handleSelectSuggestion,
  };
}
