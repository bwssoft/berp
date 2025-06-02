"use client";

import { Controller, useFormContext } from "react-hook-form";
import { CreateAccountFormSchema } from "./use-create.account.form";
import { Input, Combobox, Button, Select } from "../../../../component";
import { PlusIcon } from "@heroicons/react/24/outline";
import {
  SectorModal,
  useSectorModal,
} from "../../../../modal/comercial/sector";
import { ICnpjaResponse } from "@/app/lib/@backend/domain";
import { useCallback, useState } from "react";
import { debounce } from "lodash";

interface CNPJAccountFormProps {
  validationEnterprise?: (
    value: string,
    groupType: "controlled" | "holding"
  ) => Promise<ICnpjaResponse | ICnpjaResponse[] | null | undefined>;
  dataHolding: ICnpjaResponse[];
  dataControlled: ICnpjaResponse[];
  selectedControlled: ICnpjaResponse[] | null;
  setSelectedControlled: (value: ICnpjaResponse[] | null) => void;
}

export function CNPJAccountForm({
  validationEnterprise,
  dataHolding,
  dataControlled,
  selectedControlled,
  setSelectedControlled,
}: CNPJAccountFormProps) {
  const sectorModal = useSectorModal();
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateAccountFormSchema>();

  const debouncedValidationHolding = useCallback(
    debounce(async (value: string) => {
      if (validationEnterprise) {
        await validationEnterprise(value, "holding");
      }
    }, 500),
    [validationEnterprise]
  );

  const debouncedValidationControlled = useCallback(
    debounce(async (value: string) => {
      if (validationEnterprise) {
        await validationEnterprise(value, "controlled");
      }
    }, 500),
    [validationEnterprise]
  );

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
              value={sectorModal.sectors.find((d) => d.name === field.name)}
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
              value={dataHolding.filter((item) => item.taxId === field.value)}
              onChange={(item) => console.log(item)}
              onOptionChange={([item]) => field.onChange(item.taxId)}
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
                field.onChange(selectedItems.map((item) => item.taxId));
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
