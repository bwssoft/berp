"use client";
import { useUpdateAccountForm } from "./use-update-account-data.account.form";
import { IAccount, ISector } from "@/app/lib/@backend/domain";
import { PlusIcon } from "lucide-react";
import { SectorModal, useSectorModal } from "@/app/lib/@frontend/ui/modal";
import { Combobox } from '@/frontend/ui/component/combobox/index';

import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { formatLgpdCpf } from "@/app/lib/util/format-lgpd-cpf";
import { formatLgpdCnpj } from "@/app/lib/util/format-lgpd-cnpj";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/ui/component/select';


import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../../component/form";
import { FormProvider } from "react-hook-form";
import { useSectorDeleteDialog } from "@/app/lib/@frontend/ui/dialog/commercial/sector/delete/use-delete-sector.dialog";

interface Props {
  accountData?: IAccount;
  closeModal: () => void;
  lgpdPermissions?: {
    fullLgpdAccess?: boolean;
    partialLgpdAccess?: boolean;
  };
}

export function UpdateAccountDataForm({
  accountData,
  closeModal,
  lgpdPermissions,
}: Props) {
  const { methods, onSubmit, register, errors, control } = useUpdateAccountForm(
    { accountData, closeModal }
  );
  console.log("🚀 ~ UpdateAccountDataForm ~ errors:", errors);
  const sectorModal = useSectorModal();

  const [canShowSectorButton, setCanShowSectorButton] =
    useState<boolean>(false);

  // Helper function to format document value based on type and LGPD permissions
  const formatDocumentValue = (
    documentValue: string,
    documentType: string
  ): string => {
    if (!documentValue) return "";

    const permissions = lgpdPermissions || {};

    if (documentType === "cnpj") {
      return formatLgpdCnpj(documentValue, permissions);
    } else if (documentType === "cpf") {
      return formatLgpdCpf(documentValue, permissions);
    }

    return documentValue;
  };

  const deleteDlg = useSectorDeleteDialog();

  function handleAskDelete(s: ISector) {
    deleteDlg.openDialog(s);
  }

  useEffect(() => {
    (async () => {
      try {
        const sectorPermission = await restrictFeatureByProfile(
          "commercial:accounts:new:sector"
        );
        setCanShowSectorButton(sectorPermission);
      } catch (error) {
        console.error("Error checking sector permission:", error);
      }
    })();
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {accountData?.document.type === "cnpj" && (
          <div className="flex flex-col gap-2">
            <Input
              value={formatDocumentValue(
                accountData?.document.value || "",
                "cnpj"
              )}
              label={"CNPJ"}
              disabled
              error={methods.formState.errors.document?.value?.message}
            />
            <Input
              label="Razão Social"
              placeholder="Digite a razão social"
              {...register("cnpj.social_name")}
              disabled
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
              onChange={(e) => {
                const formatted = e.target.value.replace(/\D/g, "");
                methods.setValue("cnpj.state_registration", formatted, {
                  shouldValidate: true,
                });
              }}
              error={errors.cnpj?.state_registration?.message}
            />
            <Input
              label="Situação CNPJ"
              placeholder="Digite a situação do CNPJ"
              {...register("cnpj.status")}
              error={errors.cnpj?.status?.message}
            />
            <div className="flex gap-2">
              <div className="w-1/2">
                <Controller
                  control={control}
                  name="cnpj.situationIE"
                  render={({ field }: { field: any }) => (
                    <Combobox
                      type="single"
                      label="Situação IE"
                      data={[
                        { id: "1", text: "Habilitada", status: true },
                        { id: "2", text: "Não habilitada", status: false },
                      ]}
                      value={field.value ? [field.value] : []}
                      onOptionChange={(selectedItems: any[]) => {
                        const item = selectedItems[0];
                        if (item) {
                          field.onChange(item);
                        } else {
                          field.onChange(undefined);
                        }
                      }}
                      error={errors.cnpj?.situationIE?.message}
                      keyExtractor={(item: any) => item.id}
                      placeholder="Selecione a situação IE"
                      displayValueGetter={(item: any) => item.text}
                      modal={false}
                    />
                  )}
                />
              </div>
              <div className="w-1/2">
                <Controller
                  control={control}
                  name="cnpj.typeIE"
                  render={({ field }: { field: any }) => (
                    <Input
                      label="Tipo IE"
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Digite o tipo IE"
                      error={errors.cnpj?.typeIE?.message}
                    />
                  )}
                />
              </div>
            </div>
            <Input
              label="Inscrição Municipal"
              placeholder="Digite a inscrição municipal"
              {...register("cnpj.municipal_registration")}
              onChange={(e) => {
                const formatted = e.target.value.replace(/\D/g, "");
                methods.setValue("cnpj.municipal_registration", formatted, {
                  shouldValidate: true,
                });
              }}
              error={errors.cnpj?.municipal_registration?.message}
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
                onAskDelete={handleAskDelete}
              />
            </div>
          </div>
        )}
        {accountData?.document.type === "cpf" && (
          <div className="flex flex-col gap-2">
            <Input
              value={formatDocumentValue(
                accountData?.document.value || "",
                "cpf"
              )}
              label={"CPF"}
              disabled
              error={methods.formState.errors.document?.value?.message}
            />
            <Input
              label="Nome completo"
              placeholder="Digite o nome completo"
              {...methods.register("cpf.name")}
              error={methods.formState.errors.cpf?.name?.message}
            />
            <Input
              label="RG"
              placeholder={"Digite seu RG"}
              {...methods.register("cpf.rg")}
              error={methods.formState.errors.cpf?.rg?.message}
            />
          </div>
        )}

        <div className="flex mt-6 justify-end">
          <Button type="button" variant="ghost" onClick={closeModal}>
            Cancelar
          </Button>
          <Button
            variant="default"
            type="submit"
            disabled={sectorModal.isLoading}
          >
            {sectorModal.isLoading ? "Carregando setores..." : "Salvar"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
