"use client";

import { Controller } from "react-hook-form";
import { useCreateAccountFormContext } from "@/app/lib/@frontend/context/create-account-form.context";
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
import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../component/form";
import { SectorDeleteDialog } from "../../../../dialog/commercial/sector/delete/delete-sector.dialog";
import { useSectorDeleteDialog } from "../../../../dialog/commercial/sector/delete/use-delete-sector.dialog";
import { ISector } from "@/app/lib/@backend/domain";

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
    selectedIE,
    setSelectedIE,
    methods,
  } = useCreateAccountFormContext();

  const sectorModal = useSectorModal();
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = methods;

  const [canShowSectorButton, setCanShowSectorButton] = useState<boolean>(true);

  const deleteDlg = useSectorDeleteDialog();

  function handleAskDelete(s: ISector) {
    sectorModal.closeModal();
    setTimeout(() => deleteDlg.openDialog(s), 0);
  }

  return (
    <div className="flex flex-col gap-3">
      <Input
        label="Razão Social"
        placeholder="Digite a razão social"
        {...register("cnpj.social_name")}
        required
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
        onChange={(e) => {
          const formatted = e.target.value.replace(/\D/g, "");
          setValue("cnpj.state_registration", formatted, {
            shouldValidate: true,
          });
        }}
        error={errors.cnpj?.state_registration?.message}
        disabled={disabledFields.state_registration}
      />
      <Controller
        control={control}
        name="cnpj.status"
        render={({ field }) => (
          <Input
            label="Situação CNPJ"
            value={field.value}
            onAbort={field.onChange}
            placeholder="Digite a situação do CNPJ"
            error={errors.cnpj?.status?.message}
            disabled={disabledFields.status}
          />
        )}
      />
      <Controller
        control={control}
        name="cnpj.situationIE"
        render={({ field }) => (
          <Combobox
            type="single"
            label="Situação IE"
            data={[
              { id: "1", text: "Habilitada", status: true },
              { id: "2", text: "Não habilitada", status: false },
            ]}
            value={selectedIE ? [selectedIE] : []}
            onOptionChange={(selectedItems) => {
              const item = selectedItems[0];
              if (item) {
                setSelectedIE(item);
                field.onChange(item);
              } else {
                setSelectedIE(null);
                field.onChange(undefined);
              }
            }}
            error={errors.cnpj?.situationIE?.message}
            keyExtractor={(item) => item.id}
            placeholder="Selecione a situação IE"
            displayValueGetter={(item) => item.text}
            disabled={disabledFields.status}
            modal={false}
          />
        )}
      />
      <Controller
        control={control}
        name="cnpj.typeIE"
        render={({ field }) => (
          <Input
            label="Tipo IE"
            value={field.value}
            onChange={field.onChange}
            placeholder="Digite o tipo IE"
            error={errors.cnpj?.typeIE?.message}
            disabled={disabledFields.typeIE}
          />
        )}
      />
      <Input
        label="Inscrição Municipal"
        placeholder="Digite a inscrição municipal"
        {...register("cnpj.municipal_registration")}
        onChange={(e) => {
          const formatted = e.target.value.replace(/\D/g, "");
          setValue("cnpj.municipal_registration", formatted, {
            shouldValidate: true,
          });
        }}
        error={errors.cnpj?.municipal_registration?.message}
        disabled={disabledFields.municipal_registration}
      />
      <div className="flex items-end gap-2 w-full">
        <FormField
          control={control}
          name="cnpj.sector"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>
                Setor <span className="text-red-600">*</span>
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value?.toString()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectorModal.enabledSectors.map((sector) => (
                      <SelectItem key={sector.id} value={sector.name}>
                        {sector.name}
                      </SelectItem>
                    ))}
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
          pagination={sectorModal.pagination}
          setCurrentPage={sectorModal.setCurrentPage}
          register={sectorModal.register}
          errors={sectorModal.errors}
          handleAdd={sectorModal.handleAdd}
          isPending={sectorModal.isPending}
          handleToggle={sectorModal.handleToggle}
          handleSave={sectorModal.handleSave}
          hasUnsavedChanges={sectorModal.hasUnsavedChanges}
          onAskDelete={handleAskDelete}
        />
      </div>
      <div className="flex gap-2 items-end">
        <Controller
          control={control}
          name="cnpj.economic_group_holding"
          render={({ field }) => (
            <Combobox
              disableLocalFilter={true}
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
                  field.onChange({
                    name: item.company.name,
                    taxId: item.taxId,
                  });
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
              disableLocalFilter={true}
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

      <SectorDeleteDialog
        sector={deleteDlg.sectorToDelete ?? undefined}
        open={deleteDlg.open}
        onClose={deleteDlg.closeDialog}
        onDelete={deleteDlg.deleteSector}
        isLoading={deleteDlg.isLoading}
      />
    </div>
  );
}
