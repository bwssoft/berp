import { Controller } from "react-hook-form";
import { useUpdateEconomicGroupForm } from "./use-update-economic-group-form";
import { Combobox } from "@/app/lib/@frontend/ui/component";

interface Props {
  accountId: string;
}

export function EconomicGroupAccountForm({ accountId }: Props) {
  const {
    control,
    onSubmit,
    selectedControlled,
    setSelectedControlled,
    dataHolding,
    dataControlled,
    debouncedValidationHolding,
    debouncedValidationControlled,
  } = useUpdateEconomicGroupForm(accountId);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Controller
        control={control}
        name="cnpj.economic_group_holding"
        render={({ field }) => (
          <Combobox
            data={dataHolding}
            label="Grupo Econômico (Holding)"
            behavior="search"
            onSearchChange={(text: string) => {
              debouncedValidationHolding(text);
            }}
            value={dataHolding.filter((item) => item.taxId === field.value)}
            onChange={(item) => console.log(item)}
            onOptionChange={([item]) => field.onChange(item.taxId)}
            keyExtractor={(item) => item.taxId}
            displayValueGetter={(item) => item.name}
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
            data={dataControlled}
            label="Grupo Econômico (Controladas)"
            behavior="search"
            placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
            value={selectedControlled}
            onChange={(selectedItems) => {
              setSelectedControlled(selectedItems);
              field.onChange(selectedItems.map((item) => item.taxId));
            }}
            keyExtractor={(item) => item.taxId}
            displayValueGetter={(item) => item.name}
            onSearchChange={debouncedValidationControlled}
          />
        )}
      />
    </form>
  );
}
