"use client";

import React from "react";

import { useAddressForm } from "./use-address.create.form";
import { Button, Checkbox, Input } from "../../../../component";

export function AddressCreateForm() {
    const { register, handleSubmit, loadingCep, errors } = useAddressForm();

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 bg-white px-4 sm:px-6 lg:px-8 rounded-md pb-6 shadow-sm ring-1 ring-inset ring-gray-900/10 w-full"
        >
            <Input
                label="Buscar pelo CEP"
                placeholder=""
                onLoad={() => {
                    loadingCep;
                }}
                {...register("zip_code")}
                error={errors.zip_code?.message}
            />
            <Input
                label="Logradouro"
                placeholder=""
                {...register("street")}
                error={errors.street?.message}
            />
            <Input
                label="Número"
                placeholder=""
                {...register("number")}
                error={errors.number?.message}
            />
            <Input
                label="Complemento"
                placeholder=""
                {...register("complement")}
                error={errors.complement?.message}
            />
            <Input
                label="Bairro"
                placeholder=""
                {...register("district")}
                error={errors.district?.message}
            />
            <Input
                label="Estado"
                placeholder=""
                {...register("state")}
                error={errors.state?.message}
            />
            <Input
                label="Cidade"
                placeholder=""
                {...register("city")}
                error={errors.city?.message}
            />
            <Input
                label="Ponto de Referência"
                placeholder=""
                {...register("reference_point")}
                error={errors.reference_point?.message}
            />
            <div className="mt-2">
                <span className="text-sm font-medium text-gray-700">Tipo</span>
                <div className="mt-1 grid grid-cols-2 gap-2">
                    <Checkbox
                        {...register("type")}
                        value="Comercial"
                        label="Comercial"
                    />
                    <Checkbox
                        {...register("type")}
                        value="Entrega"
                        label="Entrega"
                    />
                    <Checkbox
                        {...register("type")}
                        value="Faturamento"
                        label="Faturamento"
                    />
                    <Checkbox
                        {...register("type")}
                        value="Residencial"
                        label="Residencial"
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
                <Button title="Cancelar" type="button" variant="secondary">
                    Cancelar
                </Button>
                <Button title="Salvar" type="submit">
                    salvar
                </Button>
            </div>
        </form>
    );
}
