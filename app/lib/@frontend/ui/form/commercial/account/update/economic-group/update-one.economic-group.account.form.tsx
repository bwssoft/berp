"use client";

import { Controller } from "react-hook-form";
import { useUpdateEconomicGroupForm } from "./use-update-economic-group-form";
import { Combobox } from "@/app/lib/@frontend/ui/component";
import { Button } from "@/app/lib/@frontend/ui/component";

interface Props {
  accountId: string;
  closeModal?: () => void;
  isModalOpen: boolean;
}

export function EconomicGroupAccountForm({
  accountId,
  closeModal,
  isModalOpen,
}: Props) {
  const {
    control,
    onSubmit,
    selectedControlled,
    setSelectedControlled,
    selectedHolding,
    setSelectedHolding,
    dataHolding,
    dataControlled,
    debouncedValidationHolding,
    debouncedValidationControlled,
  } = useUpdateEconomicGroupForm(accountId, isModalOpen, closeModal);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full h-fit">
      <Controller
        control={control}
        name="cnpj.economic_group_holding"
        render={({ field }) => (
          <Combobox
            data={dataHolding.filter((item) => item && item.taxId && item.name)}
            label="Grupo Econômico (Holding)"
            behavior="search"
            onSearchChange={(text: string) => {
              debouncedValidationHolding(text);
            }}
            value={selectedHolding}
            onOptionChange={([item]) => {
              if (item) {
                setSelectedHolding([item]);
                field.onChange(item);
              } else {
                setSelectedHolding([]);
                field.onChange(undefined);
              }
            }}
            keyExtractor={(item) => item?.taxId || ""}
            displayValueGetter={(item) => item?.name || ""}
            placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
          />
        )}
      />

      <Controller
        control={control}
        name="cnpj.economic_group_controlled"
        render={({ field }) => (
          <Combobox
            type="multiple"
            data={dataControlled.filter(
              (item) => item && item.taxId && item.name
            )}
            label="Grupo Econômico (Controladas)"
            behavior="search"
            placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
            value={selectedControlled}
            onChange={(selectedItems) => {
              const validItems = selectedItems.filter((item) => item);
              setSelectedControlled(validItems);
              field.onChange(validItems);
            }}
            keyExtractor={(item) => item?.taxId || ""}
            displayValueGetter={(item) => item?.name || ""}
            onSearchChange={debouncedValidationControlled}
          />
        )}
      />
      <div className="flex gap-4 justify-end mt-6">
        <Button type="button" variant="ghost">
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
