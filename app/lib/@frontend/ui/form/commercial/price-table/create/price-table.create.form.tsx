"use client";
import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import {
  Button,
  Checkbox,
  Combobox,
  Input,
  Toggle,
} from "../../../../component";
import {
  EquipmentAccessoryPriceForm,
  SimCardPriceForm,
  ServicePriceForm,
} from "../product-form";
import { BrazilianUF } from "@/app/lib/@backend/domain";
import { usePriceTableForm } from "./use-price-table.form";
import Link from "next/link";
import { CancelPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/cancel/cancel.price-table.dialog";
import { PublishPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/publish/publish.price-table.dialog";
import { useCancelPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/cancel/use-cancel.price-table.dialog";
import { usePublishPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/publish/use-publish.price-table.dialog";
import { findManyProduct } from "@/app/lib/@backend/action/commercial/product/product.action";
import { TrashIcon } from "@heroicons/react/24/outline";
import { cn } from "@/app/lib/util";

const BRAZILIAN_UF_LIST = [
  { id: "AC", text: "Acre" },
  { id: "AL", text: "Alagoas" },
  { id: "AP", text: "Amapá" },
  { id: "AM", text: "Amazonas" },
  { id: "BA", text: "Bahia" },
  { id: "CE", text: "Ceará" },
  { id: "DF", text: "Distrito Federal" },
  { id: "ES", text: "Espírito Santo" },
  { id: "GO", text: "Goiás" },
  { id: "MA", text: "Maranhão" },
  { id: "MT", text: "Mato Grosso" },
  { id: "MS", text: "Mato Grosso do Sul" },
  { id: "MG", text: "Minas Gerais" },
  { id: "PA", text: "Pará" },
  { id: "PB", text: "Paraíba" },
  { id: "PR", text: "Paraná" },
  { id: "PE", text: "Pernambuco" },
  { id: "PI", text: "Piauí" },
  { id: "RJ", text: "Rio de Janeiro" },
  { id: "RN", text: "Rio Grande do Norte" },
  { id: "RS", text: "Rio Grande do Sul" },
  { id: "RO", text: "Rondônia" },
  { id: "RR", text: "Roraima" },
  { id: "SC", text: "Santa Catarina" },
  { id: "SP", text: "São Paulo" },
  { id: "SE", text: "Sergipe" },
  { id: "TO", text: "Tocantins" },
];

const TO_BILL_FOR_OPTIONS = [
  { id: "20.618.574/0002-16", text: "BWS - 20.618.574/0002-16" },
  { id: "41.459.104/0001-46", text: "HYBRID - 41.459.104/0001-46 (MATRIZ)" },
  { id: "41.459.104/0002-27", text: "HYBRID - 41.459.104/0002-27 (FILIAL MG)" },
  { id: "34.984.723/0001-94", text: "ICB - 34.984.723/0001-94 (MATRIZ)" },
  { id: "34.984.723/0002-75", text: "ICB - 34.984.723/0002-75 (FILIAL SP)" },
  { id: "34.984.723/0003-56", text: "ICB 34.984.723/0003-56 (FILIAL MG)" },
  { id: "31.941.680/0001-71", text: "MGC - 31.941.680/0001-71" },
  { id: "14.334.132/0001-64", text: "WFC - 14.334.132/0001-64" },
];

export function CreatePriceTableForm() {
  // Use TanStack Query to fetch products
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
            limit: 100,
          }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2, // Retry failed requests 2 times
      },
      {
        queryKey: ["products", "accessories", "TABLE-ACESS"],
        queryFn: () =>
          findManyProduct({
            filter: {
              active: true,
              "category.code": "TABLE-ACESS",
            },
            limit: 100,
          }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2, // Retry failed requests 2 times
      },
    ],
  });

  // Extract data and loading states
  const equipmentModels = equipmentQuery.data?.docs || [];
  const accessoriesItems = accessoriesQuery.data?.docs || [];
  const loadingProducts =
    equipmentQuery.isLoading || accessoriesQuery.isLoading;
  const hasError = equipmentQuery.isError || accessoriesQuery.isError;

  // Helper function to refetch all product data
  const refetchProducts = () => {
    equipmentQuery.refetch();
    accessoriesQuery.refetch();
  };

  // Use the price table form hook
  const {
    form,
    handleSubmit,
    handleSaveDraft,
    loading,
    handleEquipmentPriceChange,
    handleSimCardPriceChange,
    handleAccessoryPriceChange,
    handleServicePriceChange,
    getDefaultStartDateTime,
    getDefaultEndDateTime,
    addCondition,
    addGroup,
    groups,
    setGroups,
    handleValidationConditions,
    messageErrorCondition,
    STATUS_STYLES,
    status,
    removeCondition,
    setGroupPriority,
  } = usePriceTableForm();

  // Dialog hooks
  const {
    open: openCancelDialog,
    setOpen: setOpenCancelDialog,
    openDialog: openCancelPriceTableDialog,
    isLoading: isLoadingCancel,
    cancelPriceTable,
  } = useCancelPriceTableDialog();

  const {
    open: openPublishDialog,
    setOpen: setOpenPublishDialog,
    openDialog: openPublishPriceTableDialog,
    isLoading: isLoadingPublish,
    publishPriceTable,
  } = usePublishPriceTableDialog();

  // State to track which equipment models are toggled on
  const [enabledEquipmentWithSim, setEnabledEquipmentWithSim] = useState<
    Record<string, boolean>
  >({});
  const [enabledEquipmentWithoutSim, setEnabledEquipmentWithoutSim] = useState<
    Record<string, boolean>
  >({});
  const [enabledAccessories, setEnabledAccessories] = useState<
    Record<string, boolean>
  >({});

  // Handle equipment toggle
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

  // Handle accessories toggle
  const handleAccessoryToggle = (accessory: string, enabled: boolean) => {
    setEnabledAccessories((prev) => ({
      ...prev,
      [accessory]: enabled,
    }));
  };

  return (
    <div className="space-y-4">
      {/* Header with title and buttons */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Tabela de Preços
        </h1>
        <div className="flex gap-2">
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700"
            onClick={openPublishPriceTableDialog}
          >
            Publicar
          </Button>
          <Link href="/commercial/price-table">
            <Button type="button" variant="outline">
              Voltar
            </Button>
          </Link>
          <Button
            type="button"
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
            onClick={openCancelPriceTableDialog}
          >
            Cancelar tabela
          </Button>
          <Button
            type="submit"
            form="price-table-form"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {loading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </div>

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
                  <Input
                    label="Data de início"
                    type="datetime-local"
                    required
                    {...form.register("startDateTime", {
                      setValueAs: (value) => new Date(value),
                    })}
                    defaultValue={getDefaultStartDateTime()}
                    error={form.formState.errors.startDateTime?.message}
                  />
                  <Input
                    label="Data de fim"
                    type="datetime-local"
                    required
                    {...form.register("endDateTime", {
                      setValueAs: (value) => new Date(value),
                    })}
                    defaultValue={getDefaultEndDateTime()}
                    error={form.formState.errors.endDateTime?.message}
                  />
                </div>
              </div>

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

              {/* Configurações de faturamento */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">
                  Configurações de Faturamento
                </h3>

                {groups.map((group, gi) => (
                  <div
                    key={group.id}
                    className="space-y-2 rounded-lg border p-3"
                  >
                    {group.conditions.map((cond) => (
                      <div key={cond.id} className="flex gap-2 items-end">
                        <Combobox
                          label="Vendas para"
                          placeholder="Selecione"
                          data={BRAZILIAN_UF_LIST}
                          value={BRAZILIAN_UF_LIST.filter((uf) =>
                            cond.salesFor.includes(uf.id as BrazilianUF)
                          )}
                          onChange={(v: { id: string; text: string }[]) =>
                            setGroups((prev) =>
                              prev.map((g) =>
                                g.id === group.id
                                  ? {
                                      ...g,
                                      conditions: g.conditions.map((c) =>
                                        c.id === cond.id
                                          ? {
                                              ...c,
                                              salesFor: v.map(
                                                (item) => item.id
                                              ) as BrazilianUF[],
                                            }
                                          : c
                                      ),
                                    }
                                  : g
                              )
                            )
                          }
                          keyExtractor={(e) => e.id}
                          displayValueGetter={(e) => e.text}
                        />
                        <Input
                          label="Limite de faturamento"
                          value={cond.billingLimit}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setGroups((prev) =>
                              prev.map((g) =>
                                g.id === group.id
                                  ? {
                                      ...g,
                                      conditions: g.conditions.map((c) =>
                                        c.id === cond.id
                                          ? {
                                              ...c,
                                              billingLimit: e.target.value,
                                            }
                                          : c
                                      ),
                                    }
                                  : g
                              )
                            )
                          }
                        />
                        <Combobox
                          label="Faturar para"
                          placeholder="Selecione"
                          data={TO_BILL_FOR_OPTIONS.map((option) => option.id)}
                          value={cond.toBillFor ? [cond.toBillFor] : []}
                          onChange={(v: string[]) =>
                            setGroups((prev) =>
                              prev.map((g) =>
                                g.id === group.id
                                  ? {
                                      ...g,
                                      conditions: g.conditions.map((c) =>
                                        c.id === cond.id
                                          ? { ...c, toBillFor: v[0] ?? "" }
                                          : c
                                      ),
                                    }
                                  : g
                              )
                            )
                          }
                          keyExtractor={(id) => id}
                          displayValueGetter={(id) =>
                            TO_BILL_FOR_OPTIONS.find(
                              (option) => option.id === id
                            )?.text ?? id
                          }
                        />
                        <Button
                          variant={"outline"}
                          type="button"
                          onClick={() => removeCondition(group.id, cond.id)}
                          title="Remover condição"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <div className="flex gap-2 items-center mt-2">
                      <Button
                        className="bg-purple-600 w-fit"
                        type="button"
                        onClick={() => addCondition(group.id)}
                      >
                        Nova condição
                      </Button>
                      <Checkbox
                        checked={group.priority || false}
                        onChange={() =>
                          setGroupPriority(group.id, !group.priority!)
                        }
                        label="Habilitar prioridade"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões para condições */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  className="bg-blue-600"
                  onClick={addGroup}
                >
                  Novo grupo de condições
                </Button>
                <Button
                  type="button"
                  className="bg-green-600"
                  onClick={handleValidationConditions}
                >
                  Validar condições
                </Button>
              </div>
              {/* mensagens de erro ou sucesso na validação das condições */}
              {messageErrorCondition.status && (
                <div
                  className={cn(
                    "flex items-center gap-2 py-4 rounded-md px-4 border-l-4",
                    STATUS_STYLES[status]
                  )}
                >
                  {messageErrorCondition.status == "green" && (
                    <CheckCircleIcon className="text-[#3cd59d] h-6 w-6" />
                  )}
                  {messageErrorCondition.status == "yellow" && (
                    <ExclamationTriangleIcon className="text-[#fcc73e] h-6 w-6" />
                  )}
                  {messageErrorCondition.status == "red" && (
                    <XCircleIcon className="text-[#f87272] h-6 w-6" />
                  )}
                  <p
                    className={`font-medium text-sm ${messageErrorCondition.status == "red" && "text-[#ad4444]"} ${messageErrorCondition.status == "yellow" && "text-[#b77f58]"} ${messageErrorCondition.status == "green" && "text-[#6cb39d]"}`}
                  >
                    {messageErrorCondition.message}
                  </p>
                </div>
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
                  <h3 className="font-semibold text-sm">Venda com SIM Card</h3>
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
                          Nenhum equipamento encontrado com categoria TABLE-RAST
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
                                  enabledEquipmentWithSim[equipment.id] || false
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
                                  enabledEquipmentWithSim[equipment.id] || false
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
                  <h3 className="font-semibold text-sm">Venda sem SIM Card</h3>
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
                          Nenhum equipamento encontrado com categoria TABLE-RAST
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
                  <SimCardPriceForm onPriceChange={handleSimCardPriceChange} />
                </DisclosurePanel>
              </Disclosure>

              {/* Venda de Acessórios */}
              <Disclosure>
                <DisclosureButton className="border border-gray-200 rounded-md w-full p-3 group flex justify-between items-center gap-2 bg-gray-50">
                  <h3 className="font-semibold text-sm">Venda de Acessórios</h3>
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
                          Nenhum acessório encontrado com categoria TABLE-ACESS
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
                  <ServicePriceForm onPriceChange={handleServicePriceChange} />
                </DisclosurePanel>
              </Disclosure>
            </DisclosurePanel>
          </div>
        </Disclosure>
      </form>

      {/* Dialogs */}
      <CancelPriceTableDialog
        open={openCancelDialog}
        setOpen={setOpenCancelDialog}
        confirm={cancelPriceTable}
        isLoading={isLoadingCancel}
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
