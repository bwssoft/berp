"use client";

import { Controller } from "react-hook-form";
import { useCreateAccountFormContext } from "@/app/lib/@frontend/context/create-account-form.context";
import { Input } from '@/frontend/ui/component/input';
import { Combobox } from '@/frontend/ui/component/combobox/index';
import { Button } from '@/frontend/ui/component/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/ui/component/select';

import { PlusIcon } from "@heroicons/react/24/outline";
import {
  SectorModal,
  useSectorModal,
} from "../../../../modal/comercial/sector";
import { useState } from "react";
import { deleteOneSector } from "@/app/lib/@backend/action/commercial/sector.action";
import { toast } from "@/app/lib/@frontend/hook/use-toast";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../component/form";
import { SectorDeleteDialog } from "../../../../dialog/commercial/sector/delete/delete-sector.dialog";
import { useSectorDeleteDialog } from "../../../../dialog/commercial/sector/delete/use-delete-sector.dialog";
import {ISector} from "@/app/lib/@backend/domain/commercial/entity/sector.definition";

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
    handleHoldingSelection,
    selectedIE,
    setSelectedIE,
    validateControlledEnterprises,
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
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteDlg = useSectorDeleteDialog();

  function handleAskDelete(s: ISector) {
    deleteDlg.openDialog(s);
  }

  const handleDelete = async () => {
    if (!deleteDlg.sectorToDelete) return;

    setIsDeleting(true);
    const sectorToDeleteId = deleteDlg.sectorToDelete.id;

    try {
      await deleteOneSector({ id: sectorToDeleteId });

      deleteDlg.closeDialog();

      // Refresh the sectors data in the modal
      await sectorModal.refreshSectors();

      toast({
        title: "Sucesso!",
        description: "Setor excluído com sucesso!",
        variant: "success",
      });
    } catch (err) {
      console.error("Erro ao excluir setor:", err);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o setor.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
          name="economic_group.economic_group_holding"
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
                handleHoldingSelection(item || null);
                if (item) {
                  field.onChange({
                    name: item.company.name,
                    taxId: item.taxId,
                  });
                } else {
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
          name="economic_group.economic_group_controlled"
          render={({ field }) => (
            <Combobox
              disableLocalFilter={true}
              type="multiple"
              data={dataControlled}
              label="Grupo Econômico (Controladas)"
              behavior="search"
              placeholder="Digite o CNPJ, Razão Social ou Nome Fantasia..."
              value={selectedControlled || []}
              onChange={async (selectedItems) => {
                // Check for duplicates within the current selection
                const taxIds = selectedItems.map((item) =>
                  item.taxId.replace(/\D/g, "")
                );
                const uniqueTaxIds = new Set(taxIds);

                if (taxIds.length !== uniqueTaxIds.size) {
                  toast({
                    title: "Seleção Duplicada",
                    description:
                      "Você não pode selecionar a mesma empresa mais de uma vez.",
                    variant: "error",
                  });
                  return; // Don't update the selection
                }

                // Only validate if we're adding new companies (not removing)
                const isAddingCompanies =
                  selectedItems.length > (selectedControlled?.length || 0);

                if (isAddingCompanies) {
                  const currentTaxIds = (selectedControlled || []).map((item) =>
                    item.taxId.replace(/\D/g, "")
                  );

                  const newlyAddedItems = selectedItems.filter((item) => {
                    const cleanTaxId = item.taxId.replace(/\D/g, "");
                    return !currentTaxIds.includes(cleanTaxId);
                  });

                  if (newlyAddedItems.length > 0) {
                    const isValid =
                      await validateControlledEnterprises(newlyAddedItems);
                    if (!isValid) {
                      return;
                    }
                  }
                }

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
        onDelete={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
