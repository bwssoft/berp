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
import { DebouncedFunc } from "lodash";

interface CNPJAccountFormProps {
  dataHolding: ICnpjaResponse[];
  debouncedValidationHolding: DebouncedFunc<(value: string) => Promise<void>>;
  debouncedValidationControlled: DebouncedFunc<
    (value: string) => Promise<void>
  >;
  dataControlled: ICnpjaResponse[];
  selectedControlled: ICnpjaResponse[] | null;
  setSelectedControlled: (value: ICnpjaResponse[] | null) => void;
}

export function CNPJAccountForm({
  dataHolding,
  dataControlled,
  selectedControlled,
  setSelectedControlled,
  debouncedValidationControlled,
  debouncedValidationHolding,
}: CNPJAccountFormProps) {
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
      <Controller
        control={control}
        name="cnpj.status"
        render={({ field }) => (
          <Combobox
            keyExtractor={(item) => item.id}
            displayValueGetter={(item) => item.name}
            label="Situação"
            data={[
              { id: "Ativa", name: "Ativa" },
              { id: "Inativa", name: "Inativa" },
            ]}
            placeholder="Selecione a situação"
            {...register("cnpj.status")}
            error={errors.cnpj?.status?.message}
            value={field.value}
            onChange={([item]) => field.onChange(item.id)}
          />
        )}
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
              value={dataHolding.filter(
                (item) => item.taxId === field.value?.taxId
              )}
              onOptionChange={([item]) =>
                field.onChange({ name: item.company.name, taxId: item.taxId })
              }
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
                    return { name: item.company.name, taxId: item.taxId };
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
