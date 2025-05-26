"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input, Combobox, Button, Select } from "../../../../component";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
    SectorModal,
    useSectorModal,
} from "../../../../modal/comercial/sector";
import { ValidateField } from "../../../../component/validate-field";
export function CNPJAccountForm() {
    const sectorModal = useSectorModal();
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<CreateAccountFormSchema>();

    return (
        <div className="flex flex-col gap-2">
            <Input
                label="Razão Social"
                placeholder="Digite a razão social"
                {...register("cnpj.social_name")}
                error={errors.cnpj?.social_name?.message}
            />
            <Input
                label="Nome Fantasia"
                placeholder="Digite o nome fantasia"
                {...register("cnpj.fantasy_name")}
                error={errors.cnpj?.fantasy_name?.message}
            />
            <Input
                label="Inscrição Estadual"
                placeholder="Digite a inscrição estadual"
                {...register("cnpj.state_registration")}
                error={errors.cnpj?.state_registration?.message}
            />
            <Input
                label="Situação"
                placeholder="Sem restrição"
                {...register("cnpj.status")}
                error={errors.cnpj?.status?.message}
            />
            <Input
                label="Inscrição Municipal"
                placeholder="Digite a inscrição municipal"
                {...register("cnpj.municipal_registration")}
                error={errors.cnpj?.municipal_registration?.message}
            />
            <div className="flex items-end gap-2">
                <Controller
                    control={control}
                    name="cnpj.sector"
                    render={({ field }) => (
                        <Select
                            name="sector"
                            data={sectorModal.sectors}
                            keyExtractor={(d) => d.id!}
                            valueExtractor={(d) => d.name}
                            label="Setor"
                            value={sectorModal.sectors.find(
                                (d) => d.name === field.name
                            )}
                            onChange={(d) => field.onChange(d.name)}
                        />
                    )}
                />

                <Button
                    type="button"
                    title="Novo Setor"
                    variant="ghost"
                    onClick={sectorModal.openModal}
                    className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                    <PlusIcon className="size-5" />
                </Button>

                <SectorModal
                    open={sectorModal.open}
                    closeModal={sectorModal.closeModal}
                    sectors={sectorModal.sectors}
                    register={sectorModal.register}
                    errors={sectorModal.errors}
                    handleAdd={sectorModal.handleAdd}
                    isPending={sectorModal.isPending}
                    handleToggle={sectorModal.handleToggle}
                    handleSave={sectorModal.handleSave}
                />
            </div>
            <ValidateField<CreateAccountFormSchema>
                name="cnpj.economic_group_holding"
                label="Grupo Econômico (Holding)"
                placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
            />

            <ValidateField<CreateAccountFormSchema>
                name="cnpj.economic_group_controlled"
                label="Grupo Econômico (Controladas)"
                placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
            />
        </div>
    );
}
