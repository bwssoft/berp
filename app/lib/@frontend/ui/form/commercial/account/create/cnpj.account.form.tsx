"use client";

import { Controller, useFormContext } from "react-hook-form";
import {
    CreateAccountFormSchema,
    useCreateAccountForm,
} from "./use-create.account.form";
import {
    Input,
    Combobox,
    Button,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../../../../component";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
    SectorModal,
    useSectorModal,
} from "../../../../modal/comercial/sector";
import { ICnpjaResponse } from "@/app/lib/@backend/domain";
import { DebouncedFunc } from "lodash";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { useEffect, useState } from "react";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../../component/form";

interface CNPJAccountFormProps {
    dataHolding: ICnpjaResponse[];
    debouncedValidationHolding: DebouncedFunc<(value: string) => Promise<void>>;
    debouncedValidationControlled: DebouncedFunc<
        (value: string) => Promise<void>
    >;
    dataControlled: ICnpjaResponse[];
    selectedControlled: ICnpjaResponse[] | null;
    setSelectedControlled: (value: ICnpjaResponse[] | null) => void;
    disabledFields?: {
        social_name: boolean;
        fantasy_name: boolean;
        status: boolean;
        state_registration: boolean;
        municipal_registration: boolean;
    };
}

export function CNPJAccountForm() {
    const {
        dataHolding,
        dataControlled,
        setSelectedControlled,
        selectedControlled,
        debouncedValidationHolding,
        debouncedValidationControlled,
        disabledFields,
        selectedHolding,
        setSelectedHolding,
    } = useCreateAccountForm();

    const sectorModal = useSectorModal();
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<CreateAccountFormSchema>();

    const [canShowSectorButton, setCanShowSectorButton] =
        useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const hasPermission = await restrictFeatureByProfile(
                    "commercial:accounts:access:tab:data:sector"
                );
                setCanShowSectorButton(hasPermission);
            } catch (error) {
                console.error("Error checking sector permission:", error);
            }
        })();
    }, []);

    return (
        <div className="flex flex-col gap-3">
            <Input
                label="Razão Social"
                placeholder="Digite a razão social"
                {...register("cnpj.social_name")}
                error={errors.cnpj?.social_name?.message}
                disabled={disabledFields.social_name}
            />
            <Input
                label="Nome Fantasia"
                placeholder="Digite o nome fantasia"
                {...register("cnpj.fantasy_name")}
                error={errors.cnpj?.fantasy_name?.message}
                disabled={disabledFields.fantasy_name}
                className=""
            />
            <Input
                label="Inscrição Estadual"
                placeholder="Digite a inscrição estadual"
                {...register("cnpj.state_registration")}
                error={errors.cnpj?.state_registration?.message}
                disabled={disabledFields.state_registration}
            />
            <Controller
                control={control}
                name="cnpj.status"
                render={({ field }) => (
                    <Combobox
                        type="single"
                        label="Situação cadastral"
                        data={[
                            { id: "Nula", name: "Nula" },
                            { id: "Ativa", name: "Ativa" },
                            { id: "Suspensa", name: "Suspensa" },
                            { id: "Inapta", name: "Inapta" },
                            { id: "Baixada", name: "Baixada" },
                        ]}
                        value={field.value}
                        onOptionChange={(item) => field.onChange(item)}
                        error={errors.cnpj?.status?.message}
                        keyExtractor={(item) => item.id}
                        placeholder="Selecione o status"
                        displayValueGetter={(item) => item.name}
                        disabled={disabledFields.status}
                        modal={false}
                    />
                )}
            />
            <Input
                label="Inscrição Municipal"
                placeholder="Digite a inscrição municipal"
                {...register("cnpj.municipal_registration")}
                error={errors.cnpj?.municipal_registration?.message}
                disabled={disabledFields.municipal_registration}
            />
            <div className="flex items-end gap-2 w-full">


                <FormField
                    control={control}
                    name="cnpj.sector"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Setor</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value?.toString()}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o setor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sectorModal.enabledSectors.map(
                                            (sector) => (
                                                <SelectItem
                                                    key={sector.id}
                                                    value={sector.name}
                                                >
                                                    {sector.name}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {canShowSectorButton && (
                    <Button
                        type="button"
                        title="Novo Setor"
                        variant="ghost"
                        onClick={sectorModal.openModal}
                        className="rounded bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        <PlusIcon className="size-5" />
                    </Button>
                )}

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
            <div className="flex gap-2 items-end">
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
                            keyExtractor={(item) => item.taxId}
                            displayValueGetter={(item) => item.company.name}
                            placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
                        />
                    )}
                />
            </div>

            <div className="flex gap-2 items-end">
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
                            value={selectedControlled || []}
                            onChange={(selectedItems) => {
                                setSelectedControlled(selectedItems);
                                field.onChange(
                                    selectedItems.map((item) => {
                                        return {
                                            name: item.company.name,
                                            taxId: item.taxId,
                                        };
                                    })
                                );
                            }}
                            keyExtractor={(item) => item.taxId}
                            displayValueGetter={(item) => item.company.name}
                            onSearchChange={debouncedValidationControlled}
                        />
                    )}
                />
            </div>
        </div>
    );
}
