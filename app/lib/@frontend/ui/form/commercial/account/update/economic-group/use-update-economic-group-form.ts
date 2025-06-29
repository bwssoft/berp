"use client";

import { fetchCnpjData, fetchNameData } from "@/app/lib/@backend/action/cnpja";
import { findManyAccount, updateOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { EconomicGroup } from "@/app/lib/@backend/domain";
import { toast } from "@/app/lib/@frontend/hook";
import { isValidCNPJ } from "@/app/lib/util/is-valid-cnpj";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  cnpj: z.object({
    economic_group_holding: z
      .object({
        name: z.string().min(1, "CNPJ da holding é obrigatório"),
        taxId: z.string().min(1, "CNPJ da holding é obrigatório"),
      })
      .optional(),
    economic_group_controlled: z
      .array(
        z.object({
          name: z.string().min(1, "CNPJ do grupo controlado é obrigatório"),
          taxId: z.string().min(1, "CNPJ do grupo controlado é obrigatório"),
        })
      )
      .optional(),
  }),
});

export type UpdateEconomicGroupFormSchema = z.infer<typeof schema>;

export function useUpdateEconomicGroupForm(
  accountId: string,
  isModalOpen: boolean,
  closeModal?: () => void
) {
  const [dataHolding, setDataHolding] = useState<EconomicGroup[]>([]);
  const [dataControlled, setDataControlled] = useState<EconomicGroup[]>([]);
  const [selectedControlled, setSelectedControlled] = useState<EconomicGroup[]>(
    []
  );

  const [selectedHolding, setSelectedHolding] = useState<EconomicGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateEconomicGroupFormSchema>({
    resolver: zodResolver(schema),
  });

  console.log("🚀 ~ error:", errors);

  useEffect(() => {
    const fetchData = async () => {
      if (!isModalOpen) return;
      setIsLoading(true);
      try {
        const data = await findManyAccount({ id: accountId });
        const holding = data.docs[0]?.economic_group_holding;
        const controlled = data.docs[0]?.economic_group_controlled;

        if (holding && Object.keys(holding).length > 0) {
          setSelectedHolding([holding]);
          setValue("cnpj.economic_group_holding", holding);
        }

        if (controlled) {
          setSelectedControlled(controlled || []);
          setValue("cnpj.economic_group_controlled", controlled);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isModalOpen, accountId, setValue]);

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

      // Make sure data is valid before processing
      const normalized = Array.isArray(data)
        ? data
            .filter(
              (item) => item && item.taxId && item.company && item.company.name
            )
            .map((item) => ({
              taxId: item.taxId.replace(/\D/g, ""),
              name: item.company.name,
            }))
        : [];

      if (groupType === "controlled") {
        setDataControlled(normalized);
        return;
      }

      setDataHolding(normalized);
    }

    return data;
  };

  const debouncedValidationHolding = useCallback(
    debounce(async (value: string) => {
      await handleCnpjOrName(value, "holding");
    }, 500),
    []
  );

  const debouncedValidationControlled = useCallback(
    debounce(async (value: string) => {
      await handleCnpjOrName(value, "controlled");
    }, 500),
    []
  );

  const onSubmit = handleSubmit(async (formData) => {
    const holding = formData.cnpj.economic_group_holding;
    console.log("🚀 ~ onSubmit ~ holding:", holding);
    const controlled = formData.cnpj.economic_group_controlled || [];
    console.log("🚀 ~ onSubmit ~ controlled:", controlled);

    if (!holding) {
      toast({
        title: "Erro!",
        description: "Holding inválida ou não encontrada!",
        variant: "error",
      });
      return;
    }

    const payload = {
      economic_group_holding: holding,
      economic_group_controlled: controlled,
    };

    try {
      await updateOneAccount(
        { id: accountId },
        {
          economic_group_holding: payload.economic_group_holding,
          economic_group_controlled: payload.economic_group_controlled,
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["findManyAccount", accountId, isModalOpen],
      });

      toast({
        title: "Sucesso!",
        description: "Grupos econômicos atualizados com sucesso!",
        variant: "success",
      });

      closeModal?.();
    } catch (error) {
      toast({
        title: "Erro!",
        description: "Falha ao atualizar os grupos econômicos!",
        variant: "error",
      });
    }
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
    selectedHolding,
    setSelectedHolding,
    selectedControlled,
    setSelectedControlled,
    isLoading,
  };
}
