"use client";
import { useState } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
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
import { BrazilianUF, IPriceTableCondition } from "@/app/lib/@backend/domain";
import { usePriceTableForm } from "./use-price-table.form";
import Link from "next/link";
import { CancelPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/cancel/cancel.price-table.dialog";
import { PublishPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/publish/publish.price-table.dialog";
import { useCancelPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/cancel/use-cancel.price-table.dialog";
import { usePublishPriceTableDialog } from "@/app/lib/@frontend/ui/dialog/commercial/price-table/publish/use-publish.price-table.dialog";

const equipmentModels = [
  "E3+",
  "E3+S",
  "E3+ 4G",
  "BWS NB2",
  "BWS LoRa",
  "BWS NB2 LoRa",
  "BWS 4G LoRa",
  "E3+ Long Life",
  "E3+ LL + RF",
  "E3+ LL + REDES",
  "E3+ Personal",
];

const accessoriesItems = [
  "Relé (12V - 20A)",
  "Chicote Tróia - 6 pinos",
  "Chicote Tróia - 9 pinos",
  "Chicote de Instalação E3+",
  "Chicote OBD E3+",
];

const BRAZILIAN_UF_LIST = [
  {id:"AC", text:"Acre"},
  {id:"AL", text:"Alagoas"},
  {id:"AP", text:"Amapá"},
  {id:"AM", text:"Amazonas"},
  {id:"BA", text:"Bahia"},
  {id:"CE", text:"Ceará"},
  {id:"DF", text:"Distrito Federal"},
  {id:"ES", text:"Espírito Santo"},
  {id:"GO", text:"Goiás"},
  {id:"MA", text:"Maranhão"},
  {id:"MT", text:"Mato Grosso"},
  {id:"MS", text:"Mato Grosso do Sul"},
  {id:"MG", text:"Minas Gerais"},
  {id:"PA", text:"Pará"},
  {id:"PB", text:"Paraíba"},
  {id:"PR", text:"Paraná"},
  {id:"PE", text:"Pernambuco"},
  {id:"PI", text:"Piauí"},
  {id:"RJ", text:"Rio de Janeiro"},
  {id:"RN", text:"Rio Grande do Norte"},
  {id:"RS", text:"Rio Grande do Sul"},
  {id:"RO", text:"Rondônia"},
  {id:"RR", text:"Roraima"},
  {id:"SC", text:"Santa Catarina"},
  {id:"SP", text:"São Paulo"},
  {id:"SE", text:"Sergipe"},
  {id:"TO", text:"Tocantins"}
]

const TO_BILL_FOR_OPTIONS = [
  {id: "20.618.574/0002-16", text: "BWS - 20.618.574/0002-16"},
  {id: "41.459.104/0001-46", text: "HYBRID - 41.459.104/0001-46 (MATRIZ)"},
  {id: "41.459.104/0002-27", text: "HYBRID - 41.459.104/0002-27 (FILIAL MG)"},
  {id: "34.984.723/0001-94", text: "ICB - 34.984.723/0001-94 (MATRIZ)"},
  {id: "34.984.723/0002-75", text: "ICB - 34.984.723/0002-75 (FILIAL SP)"},
  {id: "34.984.723/0003-56", text: "ICB 34.984.723/0003-56 (FILIAL MG)"},
  {id: "31.941.680/0001-71", text: "MGC - 31.941.680/0001-71"},
  {id: "14.334.132/0001-64", text: "WFC - 14.334.132/0001-64"}
]

export function CreatePriceTableForm() {
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

  type Group = { id: string; conditions: IPriceTableCondition[] };

  const uid = () => (crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2));
  const emptyCondition = (): IPriceTableCondition => ({ id: uid(), salesFor: [], billingLimit: "", toBillFor: "", priority: false });

  // state para grupos e condições
  const [groups, setGroups] = useState<Group[]>([
    { id: uid(), conditions: [emptyCondition()] }
  ]);

  // adicionar novo GRUPO
  const addGroup = () =>
    setGroups(prev => [...prev, { id: uid(), conditions: [emptyCondition()] }]);

  // adicionar nova CONDIÇÃO dentro de um grupo
  const addCondition = (groupId: string, init?: Partial<IPriceTableCondition>) =>
    setGroups(prev =>
      prev.map(g =>
        g.id === groupId
          ? { ...g, conditions: [...g.conditions, { ...emptyCondition(), ...init }] }
          : g
      )
    );

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

            <Checkbox label="Tabela provisória?" />

            {/* Configurações de faturamento */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Configurações de Faturamento</h3>

              {groups.map((group, gi) => (
                <div key={group.id} className="space-y-2 rounded-lg border p-3">
                  {group.conditions.map((cond) => (
                    <div key={cond.id} className="flex gap-2 items-center">
                      <Combobox
                        label="Vendas para"
                        placeholder="Selecione"
                        data={BRAZILIAN_UF_LIST}
                        value={BRAZILIAN_UF_LIST.filter(uf => cond.salesFor.includes(uf.id as BrazilianUF))}
                        onChange={(v: { id: string; text: string }[]) =>
                          setGroups(prev =>
                            prev.map(g =>
                              g.id === group.id
                                ? {
                                    ...g,
                                    conditions: g.conditions.map(c =>
                                      c.id === cond.id
                                        ? { ...c, salesFor: v.map(item => item.id) as BrazilianUF[] }
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
                          setGroups(prev =>
                            prev.map(g =>
                              g.id === group.id
                                ? {
                                    ...g,
                                    conditions: g.conditions.map(c =>
                                      c.id === cond.id ? { ...c, billingLimit: e.target.value } : c
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
                        data={TO_BILL_FOR_OPTIONS.map(option => option.id)}
                        value={cond.toBillFor ? [cond.toBillFor] : []}
                        onChange={(v: string[]) =>
                          setGroups(prev =>
                            prev.map(g =>
                              g.id === group.id
                                ? {
                                    ...g,
                                    conditions: g.conditions.map(c =>
                                      c.id === cond.id ? { ...c, toBillFor: v[0] ?? "" } : c
                                    ),
                                  }
                                : g
                            )
                          )
                        }
                        keyExtractor={(id) => id}
                        displayValueGetter={(id) => TO_BILL_FOR_OPTIONS.find(option => option.id === id)?.text ?? id}
                      />
                    </div>
                  ))}

                  <Button className="bg-purple-600 w-fit" onClick={() => addCondition(group.id)}>
                    Nova condição
                  </Button>
                </div>
              ))}
            </div>


            {/* Botões para condições */}
            <div className="flex flex-col gap-3">

              <div className="flex gap-4">
                <Button className="bg-blue-600" onClick={addGroup}>Novo grupo de condições</Button>
                <Button className="bg-green-600">Validar condições</Button>
              </div>
            </div>
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
                  {equipmentModels.map((e, index) => (
                    <div key={`with-sim-${e}`}>
                      {index % 2 === 0 && (
                        <div className="flex justify-between bg-[#fdde9a] p-2 rounded-md">
                          <h4 className="font-semibold text-sm">{e}</h4>
                          <Toggle
                            value={enabledEquipmentWithSim[e] || false}
                            onChange={(enabled) =>
                              handleEquipmentToggle(e, enabled, "withSim")
                            }
                            disabled={false}
                            title={() => "Habilitar equipamento"}
                          />
                        </div>
                      )}
                      {index % 2 === 1 && (
                        <div className="flex justify-between bg-[#feefcc] p-2 rounded-md">
                          <h4 className="font-semibold text-sm">{e}</h4>
                          <Toggle
                            value={enabledEquipmentWithSim[e] || false}
                            onChange={(enabled) =>
                              handleEquipmentToggle(e, enabled, "withSim")
                            }
                            disabled={false}
                            title={() => "Habilitar equipamento"}
                          />
                        </div>
                      )}

                        {/* Render pricing form when equipment is enabled */}
                        {enabledEquipmentWithSim[e] && (
                          <div className="mt-4">
                            <EquipmentAccessoryPriceForm
                              equipmentModel={e}
                              onPriceChange={(prices) => {
                                handleEquipmentPriceChange(
                                  e,
                                  prices,
                                  "withSim"
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
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
                    {equipmentModels.map((e, index) => (
                      <div key={`without-sim-${e}`}>
                        {index % 2 === 0 && (
                          <div className="flex justify-between bg-[#fdde9a] p-2 rounded-md">
                            <h4 className="font-semibold text-sm">{e}</h4>
                            <Toggle
                              value={enabledEquipmentWithoutSim[e] || false}
                              onChange={(enabled) =>
                                handleEquipmentToggle(e, enabled, "withoutSim")
                              }
                              disabled={false}
                              title={() => "Habilitar equipamento"}
                            />
                          </div>
                        )}
                        {index % 2 === 1 && (
                          <div className="flex justify-between bg-[#feefcc] p-2 rounded-md">
                            <h4 className="font-semibold text-sm">{e}</h4>
                            <Toggle
                              value={enabledEquipmentWithoutSim[e] || false}
                              onChange={(enabled) =>
                                handleEquipmentToggle(e, enabled, "withoutSim")
                              }
                              disabled={false}
                              title={() => "Habilitar equipamento"}
                            />
                          </div>
                        )}

                        {/* Render pricing form when equipment is enabled */}
                        {enabledEquipmentWithoutSim[e] && (
                          <div className="mt-4">
                            <EquipmentAccessoryPriceForm
                              equipmentModel={e}
                              onPriceChange={(prices) => {
                                handleEquipmentPriceChange(
                                  e,
                                  prices,
                                  "withoutSim"
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
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
                    {accessoriesItems.map((accessory, index) => (
                      <div key={`accessory-${accessory}`}>
                        {index % 2 === 0 && (
                          <div className="flex justify-between bg-[#fdde9a] p-2 rounded-md">
                            <h4 className="font-semibold text-sm">
                              {accessory}
                            </h4>
                            <Toggle
                              value={enabledAccessories[accessory] || false}
                              onChange={(enabled) =>
                                handleAccessoryToggle(accessory, enabled)
                              }
                              disabled={false}
                              title={() => "Habilitar acessório"}
                            />
                          </div>
                        )}
                        {index % 2 === 1 && (
                          <div className="flex justify-between bg-[#feefcc] p-2 rounded-md">
                            <h4 className="font-semibold text-sm">
                              {accessory}
                            </h4>
                            <Toggle
                              value={enabledAccessories[accessory] || false}
                              onChange={(enabled) =>
                                handleAccessoryToggle(accessory, enabled)
                              }
                              disabled={false}
                              title={() => "Habilitar acessório"}
                            />
                          </div>
                        )}

                        {/* Render pricing form when accessory is enabled */}
                        {enabledAccessories[accessory] && (
                          <div className="mt-4">
                            <EquipmentAccessoryPriceForm
                              equipmentModel={accessory}
                              onPriceChange={(prices) => {
                                handleAccessoryPriceChange(accessory, prices);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
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
