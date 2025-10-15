import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { BrazilianUF, CreatePriceTableFormData } from "../create/use-price-table.form";

export function useConditionsForm(gi?: number) {
  const { control } = useFormContext<CreatePriceTableFormData>();

  const {
    fields: groupFields, 
    append: appendGroup,
    remove: removeGroup,
  } = useFieldArray({
    control,
    name: "groups",
    keyName: "rhfId",
  });

  const uid = () => crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const createEmptyCondition = () => ({
    id: uid(),
    salesFor: [] as BrazilianUF[],
    billingLimit: "",
    toBillFor: "",
  });

  const {
    fields: condFields,
    append: appendCond,
    remove: removeCond,
  } = useFieldArray({
    control,
    name: gi !== undefined ? `groups.${gi}.conditions` : "groups.0.conditions",
    keyName: "rhfId",
  });

  // ===== Observa todos os grupos (para bloquear UFs já usadas) =====
  const allGroups = useWatch({
    control,
    name: "groups",
  }) as Array<{
    id: string;
    priority?: boolean;
    conditions: Array<{
      id: string;
      salesFor?: BrazilianUF[];
      toBillFor?: string;
      billingLimit?: string;
    }>;
  }>;

  // UFs usadas por OUTROS grupos
  const usedInOtherGroups = new Set<string>();
  (allGroups ?? []).forEach((g, idx) => {
    if (gi !== undefined && idx === gi) return;
    g?.conditions?.forEach((c) =>
      (c?.salesFor ?? []).forEach((uf) => usedInOtherGroups.add(uf))
    );
  });

  // ===== Helpers para o Combobox de UFs =====
  // Apenas bloqueia UFs já usadas por outros grupos.
  // Mantém as que já estão selecionadas na condição atual.
  const getUfOptionsFor = (
    ufList: { id: string; text: string }[],
    currentValue?: string[]
  ) => {
    const current = new Set(currentValue ?? []);
    return ufList.filter(
      (opt) => !usedInOtherGroups.has(opt.id) || current.has(opt.id)
    );
  };

  const isUfDisabled = (ufId: string, currentValue?: string[]) => {
    const current = new Set(currentValue ?? []);
    return usedInOtherGroups.has(ufId) && !current.has(ufId);
  };

  return {
    groupFields,
    appendGroup,
    removeGroup,
    condFields,
    appendCond,
    removeCond,

    // factories
    createEmptyCondition,
    uid,

    control,
    getUfOptionsFor,
    isUfDisabled,
  };
}