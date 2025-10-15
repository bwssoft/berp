"use client";
import { useState, useEffect, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Button, DateInput, Input, Toggle } from "../../../../component";
import {
  EquipmentAccessoryPriceForm,
  SimCardPriceForm,
  ServicePriceForm,
} from "../product-form";
import {
  BRAZILIAN_UF_LIST,
  TO_BILL_FOR_OPTIONS,
  usePriceTableForm,
} from "./use-price-table.form";
import Link from "next/link";
import { CancelPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/cancel/cancel.price-table.dialog";
import { PublishPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/publish/publish.price-table.dialog";
import { useCancelPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/cancel/use-cancel.price-table.dialog";
import { usePublishPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/publish/use-publish.price-table.dialog";
import { findManyProduct } from "@/app/lib/@backend/action/commercial/product/product.action";
import { InactivatePriceTableDialog } from "../../../../dialog/commercial/price-table/inactivate/inactivate.price-table.dialog";
import { useInactivatePriceTableDialog } from "../../../../dialog/commercial/price-table/inactivate/use-inactivate.price-table.dialog";
import { BillingConditionsSection } from "../conditions-form/conditions.form";
import { StatusBanner } from "../../../../component/status-banner";
import { FormProvider } from "react-hook-form";
import { Tooltip, TooltipProvider } from "@radix-ui/react-tooltip";
import { TooltipContent, TooltipTrigger } from "../../../../component/tooltip";

interface UpsertPriceTableFormProps {
  priceTableId?: string;
  editMode?: boolean;
  cloneMode?: boolean;
}

export function UpsertPriceTableForm({
  priceTableId,
  editMode = false,
  cloneMode = false,
}: UpsertPriceTableFormProps = {}) {
  const [equipmentQuery, accessoriesQuery] = useQueries({
    queries: [
      {
        queryKey: ["products", "equipment", "TABLE-RAST"],
        queryFn: () =>
          findManyProduct({
            filter: {
              active: true,
              "category.code": "TABLE-RAST",
            },
          }),
      },
      {
        queryKey: ["products", "accessories", "TABLE-ACESS"],
        queryFn: () =>
          findManyProduct({
            filter: {
              active: true,
              "category.code": "TABLE-ACESS",
            },
          }),
      },
    ],
  });

  const equipmentModels = useMemo(
    () => equipmentQuery.data?.docs || [],
    [equipmentQuery.data?.docs]
  );
  const accessoriesItems = useMemo(
    () => accessoriesQuery.data?.docs || [],
    [accessoriesQuery.data?.docs]
  );
  const loadingProducts =
    equipmentQuery.isLoading || accessoriesQuery.isLoading;
  const hasError = equipmentQuery.isError || accessoriesQuery.isError;

  const refetchProducts = () => {
    equipmentQuery.refetch();
    accessoriesQuery.refetch();
  };

  const {
    form,
    handleSubmit,
    loading,
    handleEquipmentPriceChange,
    handleSimCardPriceChange,
    handleAccessoryPriceChange,
    handleServicePriceChange,
    handleValidationConditions,
    messageErrorCondition,
    STATUS_STYLES,
    status,
    existingEquipmentPayment,
    existingEquipmentSimcardPayment,
    existingSimcardPayment,
    existingServicePayment,
    priceTableStatus,
    priceTableName,
  } = usePriceTableForm({ priceTableId, editMode, cloneMode });

  const {
    open: openCancelDialog,
    setOpen: setOpenCancelDialog,
    openDialog: openCancelPriceTableDialog,
    isLoading: isLoadingCancel,
    handleCancelPriceTable,
  } = useCancelPriceTableDialog({ priceTableId });

  const {
    open: openInactiveDialog,
    setOpen: setOpenInactiveDialog,
    openDialog: openInactivePriceTableDialog,
    isLoading: isLoadingInactive,
    handleInactivatePriceTable,
  } = useInactivatePriceTableDialog({
    priceTableId,
    onSuccess: () => {
      window.location.href = "/commercial/price-table";
    },
  });

  const {
    open: openPublishDialog,
    setOpen: setOpenPublishDialog,
    openDialog: openPublishPriceTableDialog,
    isLoading: isLoadingPublish,
    publishPriceTable,
    fieldErrors,
    clearFieldError,
  } = usePublishPriceTableDialog({
    priceTableId,
    onSuccess: () => {
      window.location.reload();
    },
  });

  const [enabledEquipmentWithSim, setEnabledEquipmentWithSim] = useState<
    Record<string, boolean>
  >({});
  const [enabledEquipmentWithoutSim, setEnabledEquipmentWithoutSim] = useState<
    Record<string, boolean>
  >({});
  const [enabledAccessories, setEnabledAccessories] = useState<
    Record<string, boolean>
  >({});

  const handleEquipmentToggle = (
    equipment: string,
    enabled: boolean,
    type: "withSim" | "withoutSim"
  ) => {
    if (type === "withSim") {
      setEnabledEquipmentWithSim((prev) => ({
        ...prev,
        [equipment]: enabled,
      }));
    } else {
      setEnabledEquipmentWithoutSim((prev) => ({
        ...prev,
        [equipment]: enabled,
      }));
    }
  };

  const handleAccessoryToggle = (accessory: string, enabled: boolean) => {
    setEnabledAccessories((prev) => ({
      ...prev,
      [accessory]: enabled,
    }));
  };

  useEffect(() => {
    const newEnabledEquipmentWithSim: Record<string, boolean> = {};
    const newEnabledEquipmentWithoutSim: Record<string, boolean> = {};
    const newEnabledAccessories: Record<string, boolean> = {};
    const accessoryIds = new Set(accessoriesItems.map((acc) => acc.id));

    // Initialize equipment WITH SIM card toggles
    if (
      existingEquipmentSimcardPayment &&
      existingEquipmentSimcardPayment.length > 0
    ) {
      existingEquipmentSimcardPayment.forEach((equipment) => {
        newEnabledEquipmentWithSim[equipment.productId] = true;
      });
    }

    if (existingEquipmentPayment && existingEquipmentPayment.length > 0) {
      existingEquipmentPayment.forEach((equipment) => {
        const isAccessory = accessoryIds.has(equipment.productId);
        if (isAccessory) {
          newEnabledAccessories[equipment.productId] = true;
        } else {
          newEnabledEquipmentWithoutSim[equipment.productId] = true;
        }
      });
    }

    setEnabledEquipmentWithSim(newEnabledEquipmentWithSim);
    setEnabledEquipmentWithoutSim(newEnabledEquipmentWithoutSim);
    setEnabledAccessories(newEnabledAccessories);
  }, [
    existingEquipmentPayment,
    existingEquipmentSimcardPayment,
    accessoriesItems,
  ]);

  const hasRequiredPaymentData = () => {
    const hasExistingPayments =
      (existingEquipmentPayment && existingEquipmentPayment.length > 0) ||
      (existingEquipmentSimcardPayment &&
        existingEquipmentSimcardPayment.length > 0) ||
      (existingSimcardPayment && existingSimcardPayment.length > 0) ||
      (existingServicePayment && existingServicePayment.length > 0);

    return hasExistingPayments;
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string | null) => {
    if (!status) return null;

    const statusColors = {
      DRAFT: "bg-gray-100 text-gray-800",
      ACTIVE: "bg-green-100 text-green-800",
      INACTIVE: "bg-red-100 text-red-800",
      CANCELLED: "bg-red-100 text-red-800",
      AWAITING_PUBLICATION: "bg-yellow-100 text-yellow-800",
    };

    const statusLabels = {
      DRAFT: "Rascunho",
      ACTIVE: "Ativo",
      INACTIVE: "Inativo",
      CANCELLED: "Cancelado",
      AWAITING_PUBLICATION: "Aguardando Publicação",
    };

    const colorClass =
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800";
    const label = statusLabels[status as keyof typeof statusLabels] || status;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
      >
        {label}
      </span>
    );
  };

  // Determine button visibility based on state
  const isCreatingNew = !editMode || !priceTableId;
  const isDraft = priceTableStatus === "DRAFT" || priceTableStatus === null;
  const isActive = priceTableStatus === "ACTIVE";

  return (
    <div className="space-y-4">
      {/* Header with title and buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-900">
            Tabela de Preços
          </h1>
          {editMode && priceTableName && (
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-600">-</span>
              <span className="text-lg text-gray-700">{priceTableName}</span>
              <span className="text-lg text-gray-600">-</span>
              <span className="text-lg text-gray-700">{priceTableId}</span>

              {getStatusBadge(priceTableStatus)}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {/* Publicar button - only show for DRAFT with required payment data */}
          {isDraft && hasRequiredPaymentData() && (
            <Button
              type="button"
              className="bg-green-600 hover:bg-green-700"
              onClick={openPublishPriceTableDialog}
            >
              Publicar
            </Button>
          )}

          {/* Voltar button - always show */}
          <Link href="/commercial/price-table">
            <Button type="button" variant="outline">
              Voltar
            </Button>
          </Link>

          {/* Cancelar button - only show for DRAFT when editing */}
          {isDraft && !isCreatingNew && (
            <Button
              type="button"
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={openCancelPriceTableDialog}
            >
              Cancelar tabela
            </Button>
          )}

          {/* Inativar button - only show for ACTIVE */}
          {isActive && (
            <Button
              type="button"
              variant="outline"
              onClick={openInactivePriceTableDialog}
            >
              Inativar tabela
            </Button>
          )}

          {/* Salvar button - show for creating new or editing DRAFT */}
          {(isCreatingNew || isDraft) && (
            <Button
              type="submit"
              form="price-table-form"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          )}
        </div>
      </div>

      {editMode && priceTableName && (
        <div className="flex items-center gap-2">
          {priceTableId && (
            <span className="text-sm text-gray-500">ID: {priceTableId}</span>
          )}
        </div>
      )}

      <FormProvider {...form}>
        <form id="price-table-form" onSubmit={handleSubmit}>
          <Disclosure>
            <DisclosureButton className="border-b border-gray-200 w-full py-2 group flex justify-between items-center gap-2">
              <p className="flex gap-2 font-semibold text-gray-800 text-base">
                Configurações Gerais
              </p>
              <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
            </DisclosureButton>
            <div>
              <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 flex flex-col gap-4 my-4">
                <div className="flex flex-col gap-2">
                  <Input
                    label="Nome da tabela"
                    required
                    {...form.register("name")}
                    error={form.formState.errors.name?.message}
                  />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                        Data de início <span className="text-red-500">*</span>
                      </label>
                      <DateInput
                        type="dateTime"
                        value={form.watch("startDateTime")}
                        onChange={(date) => {
                          form.setValue("startDateTime", date as Date);
                           clearFieldError("startDateTime");
                        }}
                        placeholder="Selecione a data de início"
                        className="w-full"
                      />
                      {(fieldErrors.startDateTime || form.formState.errors.startDateTime?.message) && (
                        <p className="mt-1 text-sm text-red-600">
                          {fieldErrors.startDateTime || form.formState.errors.startDateTime?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      {form.watch("isTemporary") && (
                        <>
                          <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                            Data de fim <span className="text-red-500">*</span>
                          </label>
                          <DateInput
                            type="dateTime"
                            value={form.watch("endDateTime")}
                            onChange={(date) => {
                              form.setValue("endDateTime", date as Date);
                              clearFieldError("endDateTime");
                            }}
                            placeholder="Selecione a data de fim"
                            className="w-full"
                          />
                          {(fieldErrors.endDateTime || form.formState.errors.endDateTime?.message) && (
                            <p className="mt-1 text-sm text-red-600">
                              {fieldErrors.endDateTime || form.formState.errors.endDateTime?.message}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          {...form.register("isTemporary")}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />

                        <label className="text-sm font-medium text-gray-700">
                          Tabela provisória?
                        </label>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="flex w-1/6">
                      Se acionado, habilita a tabela de forma temporária, ou
                      seja, apenas ficará em vigor até a data e hora de término
                      informados no momento do cadastro. Após terminado o
                      período da tabela provisória, a última tabela não
                      provisória, volta a valer
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {/* Configurações de faturamento */}
                <BillingConditionsSection
                  ufList={BRAZILIAN_UF_LIST}
                  billToOptions={TO_BILL_FOR_OPTIONS}
                  onValidate={handleValidationConditions}
                />

                {/* mensagens de erro ou sucesso na validação das condições */}
                {messageErrorCondition && messageErrorCondition.message.map(
                    (item, index) => (
                    <StatusBanner
                      key={index}
                      status={messageErrorCondition.status}
                      message={item}
                      statusStyles={STATUS_STYLES}
                    />
                )
                )}
              </DisclosurePanel>
            </div>
          </Disclosure>

          <Disclosure>
            <DisclosureButton className="border-b border-gray-200 w-full py-2 group flex justify-between items-center gap-2">
              <p className="flex gap-2 font-semibold text-gray-800 text-base">
                Preços
              </p>
              <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
            </DisclosureButton>
            <div>
              <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 my-4 space-y-4">
                {/* Venda com SIM Card */}
                <Disclosure>
                  <DisclosureButton className="border border-gray-200 rounded-md w-full p-3 group flex justify-between items-center gap-2 bg-gray-50">
                    <h3 className="font-semibold text-sm">
                      Venda com SIM Card
                    </h3>
                    <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
                  </DisclosureButton>
                  <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 mt-2">
                    <div className="border border-gray-200 rounded-md p-2 space-y-2">
                      {loadingProducts ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Carregando equipamentos...
                          </p>
                        </div>
                      ) : hasError ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-red-500">
                            Erro ao carregar equipamentos. Tente novamente.
                          </p>
                          <button
                            onClick={refetchProducts}
                            className="text-sm text-blue-600 hover:underline mt-2"
                          >
                            Recarregar
                          </button>
                        </div>
                      ) : equipmentModels.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Nenhum equipamento encontrado com categoria
                            TABLE-RAST
                          </p>
                        </div>
                      ) : (
                        equipmentModels.map((equipment, index) => (
                          <div key={`with-sim-${equipment.id}`}>
                            {index % 2 === 0 && (
                              <div className="flex justify-between bg-[#fdde9a] p-2 rounded-md">
                                <h4 className="font-semibold text-sm">
                                  {equipment.name}
                                </h4>
                                <Toggle
                                  value={
                                    enabledEquipmentWithSim[equipment.id] ||
                                    false
                                  }
                                  onChange={(enabled) =>
                                    handleEquipmentToggle(
                                      equipment.id,
                                      enabled,
                                      "withSim"
                                    )
                                  }
                                  disabled={false}
                                  title={() => "Habilitar equipamento"}
                                />
                              </div>
                            )}
                            {index % 2 === 1 && (
                              <div className="flex justify-between bg-[#feefcc] p-2 rounded-md">
                                <h4 className="font-semibold text-sm">
                                  {equipment.name}
                                </h4>
                                <Toggle
                                  value={
                                    enabledEquipmentWithSim[equipment.id] ||
                                    false
                                  }
                                  onChange={(enabled) =>
                                    handleEquipmentToggle(
                                      equipment.id,
                                      enabled,
                                      "withSim"
                                    )
                                  }
                                  disabled={false}
                                  title={() => "Habilitar equipamento"}
                                />
                              </div>
                            )}

                            {/* Render pricing form when equipment is enabled */}
                            {enabledEquipmentWithSim[equipment.id] && (
                              <div className="mt-4">
                                <EquipmentAccessoryPriceForm
                                  equipmentModel={equipment.id}
                                  initialData={{
                                    creditPayment:
                                      existingEquipmentSimcardPayment?.find(
                                        (ep) =>
                                          ep.productId === equipment.id &&
                                          ep.paymentType === "credit"
                                      ),
                                    upfrontPayment:
                                      existingEquipmentSimcardPayment?.find(
                                        (ep) =>
                                          ep.productId === equipment.id &&
                                          ep.paymentType === "upfront"
                                      ),
                                  }}
                                  onPriceChange={(prices) => {
                                    handleEquipmentPriceChange(
                                      equipment.id,
                                      prices,
                                      "withSim"
                                    );
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                {/* Venda sem SIM Card */}
                <Disclosure>
                  <DisclosureButton className="border border-gray-200 rounded-md w-full p-3 group flex justify-between items-center gap-2 bg-gray-50">
                    <h3 className="font-semibold text-sm">
                      Venda sem SIM Card
                    </h3>
                    <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
                  </DisclosureButton>
                  <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 mt-2">
                    <div className="border border-gray-200 rounded-md p-2 space-y-2">
                      {loadingProducts ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Carregando equipamentos...
                          </p>
                        </div>
                      ) : hasError ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-red-500">
                            Erro ao carregar equipamentos. Tente novamente.
                          </p>
                          <button
                            onClick={refetchProducts}
                            className="text-sm text-blue-600 hover:underline mt-2"
                          >
                            Recarregar
                          </button>
                        </div>
                      ) : equipmentModels.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Nenhum equipamento encontrado com categoria
                            TABLE-RAST
                          </p>
                        </div>
                      ) : (
                        equipmentModels.map((equipment, index) => (
                          <div key={`without-sim-${equipment.id}`}>
                            {index % 2 === 0 && (
                              <div className="flex justify-between bg-[#fdde9a] p-2 rounded-md">
                                <h4 className="font-semibold text-sm">
                                  {equipment.name}
                                </h4>
                                <Toggle
                                  value={
                                    enabledEquipmentWithoutSim[equipment.id] ||
                                    false
                                  }
                                  onChange={(enabled) =>
                                    handleEquipmentToggle(
                                      equipment.id,
                                      enabled,
                                      "withoutSim"
                                    )
                                  }
                                  disabled={false}
                                  title={() => "Habilitar equipamento"}
                                />
                              </div>
                            )}
                            {index % 2 === 1 && (
                              <div className="flex justify-between bg-[#feefcc] p-2 rounded-md">
                                <h4 className="font-semibold text-sm">
                                  {equipment.name}
                                </h4>
                                <Toggle
                                  value={
                                    enabledEquipmentWithoutSim[equipment.id] ||
                                    false
                                  }
                                  onChange={(enabled) =>
                                    handleEquipmentToggle(
                                      equipment.id,
                                      enabled,
                                      "withoutSim"
                                    )
                                  }
                                  disabled={false}
                                  title={() => "Habilitar equipamento"}
                                />
                              </div>
                            )}

                            {/* Render pricing form when equipment is enabled */}
                            {enabledEquipmentWithoutSim[equipment.id] && (
                              <div className="mt-4">
                                <EquipmentAccessoryPriceForm
                                  equipmentModel={equipment.id}
                                  initialData={{
                                    creditPayment:
                                      existingEquipmentPayment?.find(
                                        (ep) =>
                                          ep.productId === equipment.id &&
                                          ep.paymentType === "credit"
                                      ),
                                    upfrontPayment:
                                      existingEquipmentPayment?.find(
                                        (ep) =>
                                          ep.productId === equipment.id &&
                                          ep.paymentType === "upfront"
                                      ),
                                  }}
                                  onPriceChange={(prices) => {
                                    handleEquipmentPriceChange(
                                      equipment.id,
                                      prices,
                                      "withoutSim"
                                    );
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                {/* SIM Card - Venda Avulsa */}
                <Disclosure>
                  <DisclosureButton className="border border-gray-200 rounded-md w-full p-3 group flex justify-between items-center gap-2 bg-gray-50">
                    <h3 className="font-semibold text-sm">
                      SIM Card - Venda Avulsa
                    </h3>
                    <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
                  </DisclosureButton>
                  <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 mt-2">
                    <SimCardPriceForm
                      initialData={existingSimcardPayment}
                      onPriceChange={handleSimCardPriceChange}
                    />
                  </DisclosurePanel>
                </Disclosure>

                {/* Venda de Acessórios */}
                <Disclosure>
                  <DisclosureButton className="border border-gray-200 rounded-md w-full p-3 group flex justify-between items-center gap-2 bg-gray-50">
                    <h3 className="font-semibold text-sm">
                      Venda de Acessórios
                    </h3>
                    <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
                  </DisclosureButton>
                  <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 mt-2">
                    <div className="border border-gray-200 rounded-md p-2 space-y-2">
                      {loadingProducts ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Carregando acessórios...
                          </p>
                        </div>
                      ) : hasError ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-red-500">
                            Erro ao carregar acessórios. Tente novamente.
                          </p>
                          <button
                            onClick={refetchProducts}
                            className="text-sm text-blue-600 hover:underline mt-2"
                          >
                            Recarregar
                          </button>
                        </div>
                      ) : accessoriesItems.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-sm text-gray-500">
                            Nenhum acessório encontrado com categoria
                            TABLE-ACESS
                          </p>
                        </div>
                      ) : (
                        accessoriesItems.map((accessory, index) => (
                          <div key={`accessory-${accessory.id}`}>
                            {index % 2 === 0 && (
                              <div className="flex justify-between bg-[#fdde9a] p-2 rounded-md">
                                <h4 className="font-semibold text-sm">
                                  {accessory.name}
                                </h4>
                                <Toggle
                                  value={
                                    enabledAccessories[accessory.id] || false
                                  }
                                  onChange={(enabled) =>
                                    handleAccessoryToggle(accessory.id, enabled)
                                  }
                                  disabled={false}
                                  title={() => "Habilitar acessório"}
                                />
                              </div>
                            )}
                            {index % 2 === 1 && (
                              <div className="flex justify-between bg-[#feefcc] p-2 rounded-md">
                                <h4 className="font-semibold text-sm">
                                  {accessory.name}
                                </h4>
                                <Toggle
                                  value={
                                    enabledAccessories[accessory.id] || false
                                  }
                                  onChange={(enabled) =>
                                    handleAccessoryToggle(accessory.id, enabled)
                                  }
                                  disabled={false}
                                  title={() => "Habilitar acessório"}
                                />
                              </div>
                            )}

                            {/* Render pricing form when accessory is enabled */}
                            {enabledAccessories[accessory.id] && (
                              <div className="mt-4">
                                <EquipmentAccessoryPriceForm
                                  equipmentModel={accessory.id}
                                  initialData={{
                                    creditPayment:
                                      existingEquipmentPayment?.find(
                                        (ep) =>
                                          ep.productId === accessory.id &&
                                          ep.paymentType === "credit"
                                      ),
                                    upfrontPayment:
                                      existingEquipmentPayment?.find(
                                        (ep) =>
                                          ep.productId === accessory.id &&
                                          ep.paymentType === "upfront"
                                      ),
                                  }}
                                  onPriceChange={(prices) => {
                                    handleAccessoryPriceChange(
                                      accessory.id,
                                      prices
                                    );
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                {/* Serviços */}
                <Disclosure>
                  <DisclosureButton className="border border-gray-200 rounded-md w-full p-3 group flex justify-between items-center gap-2 bg-gray-50">
                    <h3 className="font-semibold text-sm">Serviços</h3>
                    <ChevronDownIcon className="w-5 group-data-[open]:rotate-180 text-right" />
                  </DisclosureButton>
                  <DisclosurePanel className="origin-top transition duration-200 ease-out data-[closed]:-translate-y-6 data-[closed]:opacity-0 mt-2">
                    <ServicePriceForm
                      initialData={existingServicePayment}
                      onPriceChange={handleServicePriceChange}
                    />
                  </DisclosurePanel>
                </Disclosure>
              </DisclosurePanel>
            </div>
          </Disclosure>
        </form>
      </FormProvider>

      {/* Dialogs */}
      <CancelPriceTableDialog
        open={openCancelDialog}
        setOpen={setOpenCancelDialog}
        confirm={handleCancelPriceTable}
        isLoading={isLoadingCancel}
      />

      <InactivatePriceTableDialog
        open={openInactiveDialog}
        setOpen={setOpenInactiveDialog}
        confirm={handleInactivatePriceTable}
        isLoading={isLoadingInactive}
      />

      <PublishPriceTableDialog
        open={openPublishDialog}
        setOpen={setOpenPublishDialog}
        confirm={publishPriceTable}
        isLoading={isLoadingPublish}
      />
    </div>
  );
}
