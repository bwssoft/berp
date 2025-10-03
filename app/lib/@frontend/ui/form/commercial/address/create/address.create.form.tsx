import React, { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Button, Checkbox, Input } from "../../../../component";
import { Combobox } from "@/app/lib/@frontend/ui/component/combobox";
import { UF_LIST, type UF_CODES } from "@/app/lib/constant/brasil/uf";
import {
  loadCountiesByUF,
  type County,
} from "@/app/lib/constant/brasil/counties";
import { AddressFormSchema, useAddressForm } from "./use-address.create.form";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AddressCreateForm({
  closeModal,
  accountId,
  onSubmit,
  defaultValues,
}: {
  closeModal: () => void;
  accountId: string;
  onSubmit: (data: AddressFormSchema, accountId: string) => Promise<void>;
  defaultValues?: Partial<AddressFormSchema>;
}) {
  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    errors,
    formatCep,
    formatNumber,
    loadingCep,
    isSubmitting,
    setValue,
  } = useAddressForm({
    closeModal: () => {
      closeModal();
      router.refresh();
    },
    accountId,
    defaultValues,
    onSubmit,
  });

  // watch state so we can load municipalities in a child component
  const watchedState = useWatch({ control, name: "state" }) as
    | string
    | undefined;

  function CityCombobox({
    state,
    value,
    onChange,
    disabled,
    loadingCep,
  }: {
    state?: string;
    value?: string;
    onChange: (v: string) => void;
    disabled?: boolean;
    loadingCep?: boolean;
  }) {
    const [counties, setCounties] = useState<County[]>([]);
    const [isLoadingCounties, setIsLoadingCounties] = useState(false);

    useEffect(() => {
      if (!state) {
        setCounties([]);
        return;
      }
      setIsLoadingCounties(true);
      loadCountiesByUF(state as UF_CODES)
        .then((list) =>
          setCounties([...list].sort((a, b) => a.nome.localeCompare(b.nome)))
        )
        .finally(() => setIsLoadingCounties(false));
    }, [state]);

    const selectedCounty = value
      ? counties.filter((c) => c.nome === value)
      : [];

    return (
      <div>
        <label className="block text-sm font-medium mb-3">Município</label>
        <Combobox
          data={counties}
          keyExtractor={(c) => String(c.ibge)}
          displayValueGetter={(c) => c.nome}
          value={selectedCounty}
          type="single"
          behavior="search"
          placeholder={
            isLoadingCounties
              ? "Carregando municípios…"
              : "Selecione o Município"
          }
          onOptionChange={(selected) => {
            const name = selected?.[0]?.nome;
            onChange(name || "");
          }}
          disabled={disabled || !state || isLoadingCounties}
        />
      </div>
    );
  }

  const checkboxOptions = [
    { label: "Comercial", value: "Comercial" },
    { label: "Entrega", value: "Entrega" },
    { label: "Faturamento", value: "Faturamento" },
    { label: "Residencial", value: "Residencial" },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start  gap-4">
      <Controller
        name="zip_code"
        control={control}
        render={({ field }) => (
          <div className="w-full relative">
            <Input
              label="Buscar pelo CEP"
              placeholder="00000-000"
              value={formatCep(field.value)}
              onChange={(e) => field.onChange(formatCep(e.target.value))}
              error={errors.zip_code?.message}
              className={loadingCep ? "pr-10" : ""}
            />
            {loadingCep && (
              <div className="absolute right-3 top-10">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
        )}
      />
      <Input
        label="Logradouro"
        placeholder="Digite o nome da rua"
        {...register("street")}
        error={errors.street?.message}
        disabled={loadingCep}
      />
      <div className="grid grid-cols-2 gap-4 w-full">
        <Controller
          name="number"
          control={control}
          render={({ field }) => (
            <Input
              label="Número"
              placeholder="Digite o número"
              value={formatNumber(field.value || "")}
              onChange={(e) => field.onChange(formatNumber(e.target.value))}
              error={errors.number?.message}
              disabled={loadingCep}
            />
          )}
        />
        <Input
          label="Complemento"
          placeholder="Apartamento, sala, etc."
          {...register("complement")}
          error={errors.complement?.message}
          disabled={loadingCep}
        />
        <Input
          label="Bairro"
          placeholder="Digite o bairro"
          {...register("district")}
          error={errors.district?.message}
          disabled={loadingCep}
        />
        <Controller
          name="state"
          control={control}
          render={({ field }) => {
            const selected = field.value
              ? UF_LIST.filter((u) => u.uf === field.value)
              : [];
            return (
              <div>
                <label className="block text-sm font-medium mb-3">Estado</label>
                <Combobox
                  data={UF_LIST}
                  keyExtractor={(u) => u.uf}
                  displayValueGetter={(u) => u.nome}
                  value={selected}
                  type="single"
                  behavior="search"
                  placeholder="Selecione o Estado"
                  onOptionChange={(selected) => {
                    const uf = selected?.[0]?.uf;
                    field.onChange(uf || "");
                    // clear city when UF changes
                    setValue("city", "");
                  }}
                  disabled={loadingCep}
                />
              </div>
            );
          }}
        />

        <Controller
          name="city"
          control={control}
          render={({ field }) => (
            <CityCombobox
              state={watchedState}
              value={field.value}
              onChange={(v) => field.onChange(v)}
              disabled={loadingCep}
            />
          )}
        />
        <Input
          label="Ponto de Referência"
          placeholder="Próximo a..."
          {...register("reference_point")}
          error={errors.reference_point?.message}
          disabled={loadingCep}
        />
      </div>
      <div className="mt-2">
        <span className="text-sm font-medium text-gray-700">Tipo</span>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="flex gap-3">
              {checkboxOptions.map((opt) => (
                <Checkbox
                  key={opt.value}
                  label={opt.label}
                  value={opt.value}
                  checked={field.value?.includes(opt.value)}
                  disabled={loadingCep}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    if (checked)
                      field.onChange([...(field.value || []), opt.value]);
                    else
                      field.onChange(
                        (field.value || []).filter((v) => v !== opt.value)
                      );
                  }}
                />
              ))}
            </div>
          )}
        />
        {errors.type?.message && (
          <p className="text-xs text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div className="mt-4 flex justify-end gap-3  w-full">
        <Button
          title="Cancelar"
          type="button"
          variant="secondary"
          onClick={closeModal}
          disabled={loadingCep}
        >
          Cancelar
        </Button>
        <Button
          title="Salvar"
          type="submit"
          disabled={loadingCep || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </div>
    </form>
  );
}
