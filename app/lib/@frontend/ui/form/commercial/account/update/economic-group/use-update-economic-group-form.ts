"use client";
import {
  fetchCnpjData,
  fetchNameData,
  findManyAccount,
} from "@/app/lib/@backend/action";
import {
  EconomicGroup,
  IAccount,
  ICnpjaResponse,
} from "@/app/lib/@backend/domain";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { debounce, set } from "lodash";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  cnpj: z.object({
    economic_group_holding: z.string().optional(),
    economic_group_controlled: z.array(z.string()).optional(),
  }),
});

export type UpdateEconomicGroupFormSchema = z.infer<typeof schema>;

export function useUpdateEconomicGroupForm(accounId: string) {
  // Estado para guardar os dados retornados para holding e controlled
  const [dataHolding, setDataHolding] = useState<EconomicGroup[]>([]);
  const [dataControlled, setDataControlled] = useState<EconomicGroup[]>([]);
  const [selectedControlled, setSelectedControlled] = useState<EconomicGroup[]>(
    []
  );

  useQuery({
    queryKey: ["findManyAccount", accounId],
    queryFn: async () => {
      const data = await findManyAccount({ id: accounId });
      const holding = data.docs[0]?.economic_group_holding;
      holding && setDataHolding([holding]);

      const controlled = data.docs[0]?.economic_group_controlled;
      controlled && setDataControlled(controlled);
    },
  });

  const { control, handleSubmit } = useForm<UpdateEconomicGroupFormSchema>({
    resolver: zodResolver(schema),
  });

  const handleCnpjOrName = async (
    value: string,
    groupType: "controlled" | "holding"
  ) => {
    const cleanedValue = value.replace(/\D/g, "");
    let data;

    if (cleanedValue.length === 14 && isValidCNPJ(cleanedValue)) {
      // É um CNPJ válido
      data = await fetchCnpjData(cleanedValue);
    } else {
      // Se não for CNPJ, trata como nome e usa outra função
      data = await fetchNameData(value);
      const normalized = data?.map((item) => ({
        taxId: item.taxId.replace(/\D/g, ""),
        name: item.company.name,
      }));
      if (groupType === "controlled") {
        setDataControlled(normalized ?? []);
        return;
      }
      setDataHolding(normalized ?? []);
    }
    return data;
  };

  const debouncedValidationHolding = useCallback(
    debounce(async (value: string) => {
      await handleCnpjOrName(value, "holding");
    }, 500),
    [handleCnpjOrName]
  );

  const debouncedValidationControlled = useCallback(
    debounce(async (value: string) => {
      await handleCnpjOrName(value, "controlled");
    }, 500),
    [handleCnpjOrName]
  );

  const onSubmit = handleSubmit(async (data) => {
    console.log({ data });
  });

  return {
    control,
    onSubmit,
    dataHolding,
    setDataHolding,
    debouncedValidationHolding,
    debouncedValidationControlled,
    dataControlled,
    setDataControlled,
    selectedControlled,
    setSelectedControlled,
  };
}
