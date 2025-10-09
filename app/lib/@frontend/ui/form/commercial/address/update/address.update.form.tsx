"use client";

import React, { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { Button } from '@/frontend/ui/component/button';
import { Checkbox } from '@/frontend/ui/component/checkbox';
import { Input } from '@/frontend/ui/component/input';

import { Combobox } from "@/app/lib/@frontend/ui/component/combobox";
import { UF_LIST, type UF_CODES } from "@/app/lib/constant/brasil/uf";
import {
  loadCountiesByUF,
  type County,
} from "@/app/lib/constant/brasil/counties";
import {IAddress} from "@/app/lib/@backend/domain/commercial/entity/address.definition";
import { useAddressUpdateForm } from "./use-address.update.form";
import { Loader2 } from "lucide-react";

interface Props {
  address: IAddress;
  closeModal: () => void;
  onSubmit: (addressId: string, data: IAddress) => Promise<void>;
}

export function AddressUpdateForm({ address, closeModal, onSubmit }: Props) {
  const {
    register,
    registerCep,
    registerNumber,
    handleSubmit,
    loadingCep,
    errors,
    control,
    isSubmitting,
  } = useAddressUpdateForm({ address, onSubmit });
  const { setValue } = useAddressUpdateForm({ address, onSubmit });

  const watchedState = useWatch({ control, name: "state" }) as
    | string
    | undefined;

  function CityCombobox({
    state,
    value,
    onChange,
    disabled,
  }: {
    state?: string;
    value?: string;
    onChange: (v: string) => void;
    disabled?: boolean;
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
        <label className="block text-sm font-medium">Município</label>
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
          onOptionChange={(selected) => onChange(selected?.[0]?.nome || "")}
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
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-4">
      <div className="w-full relative">
        <Input
          label="Buscar pelo CEP"
          {...registerCep()}
          error={errors.zip_code?.message}
          className={loadingCep ? "pr-10" : ""}
        />
        {loadingCep && (
          <div className="absolute right-3 top-10">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </div>
      <Input
        label="Logradouro"
        {...register("street")}
        error={errors.street?.message}
        disabled={loadingCep}
      />
      <div className="grid grid-cols-2 gap-4 w-full">
        <Input
          label="Número"
          {...registerNumber()}
          error={errors.number?.message}
          disabled={loadingCep}
        />
        <Input
          label="Complemento"
          {...register("complement")}
          error={errors.complement?.message}
          disabled={loadingCep}
        />
        <Input
          label="Bairro"
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
                <label className="block text-sm font-medium">Estado</label>
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
      <div className="mt-4 flex justify-end gap-3 w-full">
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
