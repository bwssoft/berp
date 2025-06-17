"use client";
import {
  fetchCnpjData,
  fetchNameData,
  findManyAccount,
  updateOneAccount,
} from "@/app/lib/@backend/action";
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
    economic_group_holding: z.string().min(1, "CNPJ da holding é obrigatório"),
    economic_group_controlled: z.array(z.string()).optional(),
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

  const { control, handleSubmit, reset } =
    useForm<UpdateEconomicGroupFormSchema>({
      resolver: zodResolver(schema),
      defaultValues: {
        cnpj: {
          economic_group_holding: "",
          economic_group_controlled: [],
        },
      },
    });

  useEffect(() => {
    const fetchData = async () => {
      if (!isModalOpen) return;
      setIsLoading(true);
      try {
        const data = await findManyAccount({ id: accountId });
        const holding = data.docs[0]?.economic_group_holding;
        const controlled = data.docs[0]?.economic_group_controlled;

        holding && setDataHolding([holding]);
        controlled && setDataControlled(controlled);

        reset({
          cnpj: {
            economic_group_holding: holding?.taxId || "",
            economic_group_controlled:
              (controlled ?? []).map((item) => item.taxId) || [],
          },
        });

        setSelectedControlled(controlled || []);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isModalOpen]);

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
    []
  );

  const debouncedValidationControlled = useCallback(
    debounce(async (value: string) => {
      await handleCnpjOrName(value, "controlled");
    }, 500),
    []
  );

  const onSubmit = handleSubmit(async (formData) => {
    const holdingTaxId = formData.cnpj.economic_group_holding;
    const controlledTaxIds = formData.cnpj.economic_group_controlled || [];

    const holding = dataHolding.find((item) => item.taxId === holdingTaxId);
    if (!holding) return;

    const allControlled = [...selectedControlled, ...dataControlled];
    const controlled = allControlled.reduce<EconomicGroup[]>((acc, item) => {
      if (
        controlledTaxIds.includes(item.taxId) &&
        !acc.some((existing) => existing.taxId === item.taxId)
      ) {
        acc.push(item);
      }
      return acc;
    }, []);

    const payload = {
      economic_group_holding: { name: holding.name, taxId: holding.taxId },
      economic_group_controlled: controlled.map((c) => ({
        name: c.name,
        taxId: c.taxId,
      })),
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
