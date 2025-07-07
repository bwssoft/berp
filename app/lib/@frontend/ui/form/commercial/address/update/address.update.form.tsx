"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Button, Checkbox, Input } from "../../../../component";
import { IAddress } from "@/app/lib/@backend/domain";
import { useAddressUpdateForm } from "./use-address.update.form";
import { Loader2 } from "lucide-react";

interface Props {
  address: IAddress;
  closeModal: () => void;
}

export function AddressUpdateForm({ address, closeModal }: Props) {
  const {
    register,
    registerCep,
    handleSubmit,
    loadingCep,
    errors,
    control,
    isSubmitting,
  } = useAddressUpdateForm({ address, closeModal });

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
          {...register("number")}
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
        <Input
          label="Estado"
          {...register("state")}
          error={errors.state?.message}
          disabled={loadingCep}
        />
        <Input
          label="Cidade"
          {...register("city")}
          error={errors.city?.message}
          disabled={loadingCep}
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
