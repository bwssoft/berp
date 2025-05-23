"use client";

import React from "react";
import { Controller } from "react-hook-form";
import { Button, Checkbox, Input } from "../../../../component";
import { IAddress } from "@/app/lib/@backend/domain";
import { useAddressUpdateForm } from "./use-address.update.form";

interface Props {
    address: IAddress;
    closeModal: () => void;
}

export function AddressUpdateForm({ address, closeModal }: Props) {
    const { register, handleSubmit, loadingCep, errors, control } =
        useAddressUpdateForm({ address, closeModal });

    const checkboxOptions = [
        { label: "Comercial", value: "Comercial" },
        { label: "Entrega", value: "Entrega" },
        { label: "Faturamento", value: "Faturamento" },
        { label: "Residencial", value: "Residencial" },
    ] as const;

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 px-1 sm:px-6 lg:px-8 rounded-md pb-6"
        >
            <Input
                label="Buscar pelo CEP"
                onLoad={() => loadingCep}
                {...register("zip_code")}
                error={errors.zip_code?.message}
            />
            <Input
                label="Logradouro"
                {...register("street")}
                error={errors.street?.message}
            />
            <Input
                label="Número"
                {...register("number")}
                error={errors.number?.message}
            />
            <Input
                label="Complemento"
                {...register("complement")}
                error={errors.complement?.message}
            />
            <Input
                label="Bairro"
                {...register("district")}
                error={errors.district?.message}
            />
            <Input
                label="Estado"
                {...register("state")}
                error={errors.state?.message}
            />
            <Input
                label="Cidade"
                {...register("city")}
                error={errors.city?.message}
            />
            <Input
                label="Ponto de Referência"
                {...register("reference_point")}
                error={errors.reference_point?.message}
            />
            <div className="mt-2">
                <span className="text-sm font-medium text-gray-700">Tipo</span>
                <Controller
                    control={control}
                    name="type"
                    render={({ field }) => (
                        <>
                            {checkboxOptions.map((opt) => (
                                <Checkbox
                                    key={opt.value}
                                    label={opt.label}
                                    value={opt.value}
                                    checked={field.value?.includes(opt.value)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        if (checked) {
                                            field.onChange([
                                                ...(field.value || []),
                                                opt.value,
                                            ]);
                                        } else {
                                            field.onChange(
                                                (field.value || []).filter(
                                                    (v) => v !== opt.value
                                                )
                                            );
                                        }
                                    }}
                                />
                            ))}
                        </>
                    )}
                />
            </div>
            <div className="mt-4 flex justify-end gap-3">
                <Button title="Cancelar" type="button" variant="secondary">
                    Cancelar
                </Button>
                <Button title="Salvar" type="submit">
                    Salvar
                </Button>
            </div>
        </form>
    );
}
