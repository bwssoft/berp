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
import { EquipmentPriceForm } from "../product-form/equipment-price-form";

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

export function CreatePriceTableForm() {
  // State to track which equipment models are toggled on
  const [enabledEquipmentWithSim, setEnabledEquipmentWithSim] = useState<
    Record<string, boolean>
  >({});
  const [enabledEquipmentWithoutSim, setEnabledEquipmentWithoutSim] = useState<
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

  return (
    <>
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
              <Input label="Nome da tabela" required />
              <div className="flex gap-4">
                <Input label="Data de início" required />
                <Input label="Hora de início" required />
              </div>
            </div>

            <Checkbox label="Tabela provisória?" />

            {/* Configurações de faturamento */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">
                Configurações de Faturamento
              </h3>
              <div className="flex gap-4">
                <Combobox
                  label="Vendas para"
                  data={[]}
                  keyExtractor={(e) => e}
                  displayValueGetter={(e) => e}
                />
                <Input label="Limite de faturamento" />
                <Combobox
                  label="Faturar para"
                  data={[]}
                  keyExtractor={(e) => e}
                  displayValueGetter={(e) => e}
                />
              </div>
            </div>

            {/* Botões para condições */}
            <div className="flex flex-col gap-3">
              <Button className="bg-purple-600 w-fit">Nova condição</Button>

              <div className="flex gap-4">
                <Button className="bg-blue-600">Novo grupo de condições</Button>
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
            <div className="border border-gray-200 rounded-md p-2 space-y-2">
              <h3 className="font-semibold text-sm">Venda com SIM Card</h3>
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
                      <EquipmentPriceForm
                        equipmentModel={`${e} (com SIM Card)`}
                        onPriceChange={(prices) => {
                          console.log(
                            "Price change for",
                            e,
                            "with SIM:",
                            prices
                          );
                          // Handle price data here
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Venda sem SIM Card */}
            <div className="border border-gray-200 rounded-md p-2 space-y-2">
              <h3 className="font-semibold text-sm">Venda sem SIM Card</h3>
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
                      <EquipmentPriceForm
                        equipmentModel={`${e} (sem SIM Card)`}
                        onPriceChange={(prices) => {
                          console.log(
                            "Price change for",
                            e,
                            "without SIM:",
                            prices
                          );
                          // Handle price data here
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </DisclosurePanel>
        </div>
      </Disclosure>
    </>
  );
}
