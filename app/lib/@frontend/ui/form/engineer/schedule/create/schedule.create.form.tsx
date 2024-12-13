"use client";
import { ICommand, IDevice, IFirmware } from "@/app/lib/@backend/domain";
import { Button } from "@/app/lib/@frontend/ui/button";
import { useScheduleCreateForm } from "./use-schedule-create-form";
import { Radio } from "@/app/lib/@frontend/ui/radio";
import { FileUpload } from "@/app/lib/@frontend/ui/input-file";
import { Checkbox } from "@/app/lib/@frontend/ui/checkbox";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  commands: ICommand[];
  devices: IDevice[];
  firmwares: IFirmware[];
}
export function ScheduleCreateForm(props: Props) {
  const { commands, devices, firmwares } = props;
  const {
    register,
    handleSubmit,
    availableVariables,
    variablesToBeInserted,
    getValues,
    setValue,
    commandSetup,
    devicesOnForm,
    handleRemoveDevice,
    handleAppendDevice,
    handleFile,
    preview,
  } = useScheduleCreateForm();

  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Comando
              </label>
              <select
                className="w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 sm:max-w-md"
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedCommand = commands.find(
                    (command) => command.id === selectedId
                  );
                  selectedCommand && setValue("command", selectedCommand);
                  setValue("automaticFillVariables.firmware", undefined);
                  setValue("automaticFillVariables.serial", undefined);
                  setValue("commandSetup.isMultiple", true);
                  setValue("commandSetup.withFirmware", false);
                  setValue("commandSetup.withSerial", false);
                }}
              >
                <option>Selecione um comando</option>
                {commands.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                É um comando para múltiplos dispositivos?
              </label>
              <Radio
                name="type"
                data={[
                  { id: 0, label: "Sim", value: "true" },
                  { id: 1, label: "Não", value: "false" },
                ]}
                defaultCheckedItem={{
                  id: 0,
                  value: "true",
                  label: "Sim",
                }}
                keyExtractor={(d) => d.id}
                valueExtractor={(d) => d.value}
                labelExtractor={(d) => d.label}
                onChange={({ value }) =>
                  setValue("commandSetup.isMultiple", value === "true")
                }
              />
            </div>

            {commandSetup.isMultiple ? (
              <div className="sm:col-span-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Arquivo
                </label>
                <p className="text-sm leading-6 text-gray-600">
                  <a
                    href={"/xlsx/create-schedule-device-from-file.xlsx"}
                    download={"create-schedule-device-from-file.xlsx"}
                    className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2 hover:cursor-pointer"
                  >
                    Baixe o modelo
                  </a>{" "}
                  e depois faça o upload da planilha para adicionar os
                  equipamentos.
                </p>
                <FileUpload handleFile={handleFile} accept=".xlsx" />
                {devicesOnForm.map((item, index) => (
                  <div key={item.id} className="flex space-x-4 mt-2">
                    <input
                      type="text"
                      placeholder="Serial"
                      className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      {...register(`devices.${index}.serial`)}
                    />
                    <Button
                      type="button"
                      onClick={() => handleRemoveDevice(index)}
                      className="rounded-full bg-red-600 shadow-sm hover:bg-red-500 p-1 h-fit"
                    >
                      <XMarkIcon width={16} height={16} />
                    </Button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    handleAppendDevice({
                      serial: "",
                    })
                  }
                  className="mt-2 border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2"
                >
                  Adicionar Equipamento
                </button>
              </div>
            ) : (
              <div className="sm:col-span-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Equipamento
                </label>
                <select
                  className="w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 sm:max-w-md"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedDevice = devices.find(
                      (device) => device.id === selectedId
                    );
                    if (selectedDevice) {
                      setValue("devices", [{ serial: selectedDevice.serial }]);
                    }
                  }}
                >
                  <option>Selecione um equipamento</option>
                  {devices.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.serial}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-4">
              <Checkbox
                id="with-imei"
                label="Alguma das variáveis do comando representa o imei/serial do equipamento?"
                subLabel="Essa opção habilita a insersão automatica do imei/serial do equipamento na string do comando"
                checked={commandSetup.withSerial}
                onChange={(e) => {
                  if (!e.target.checked) {
                    const variableName = getValues(
                      "automaticFillVariables.serial"
                    );
                    setValue(`variablesToBeInserted.${variableName}`, "");
                    setValue("automaticFillVariables.serial", undefined);
                  }
                  setValue("commandSetup.withSerial", e.target.checked);
                }}
              />
            </div>
            {commandSetup.withSerial && (
              <div className="sm:col-span-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Qual variável representa o imei/serial?
                </label>
                <select
                  className="w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 sm:max-w-md"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const variable = availableVariables.find(
                      ([v]) => v === selectedId
                    );
                    setValue("automaticFillVariables.serial", variable?.[0]);
                  }}
                >
                  <option>Selecione uma variável</option>
                  {availableVariables.map(([key]) => (
                    <option key={key} value={key} id={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-4">
              <Checkbox
                id="with-firmware"
                label="Alguma das variáveis do comando representa um firmware?"
                subLabel="Essa opção habilita a insersão automatica do nome do firmware  na string do comando"
                checked={commandSetup.withFirmware}
                onChange={(e) => {
                  if (!e.target.checked) {
                    const variableName = getValues(
                      "automaticFillVariables.firmware"
                    );
                    setValue(`variablesToBeInserted.${variableName}`, "");
                    setValue("automaticFillVariables.firmware", undefined);
                  }
                  setValue("commandSetup.withFirmware", e.target.checked);
                }}
              />
            </div>
            {commandSetup.withFirmware && (
              <>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Qual variável representa o firmware?
                  </label>
                  <select
                    className="w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 sm:max-w-md"
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const variable = availableVariables.find(
                        ([v]) => v === selectedId
                      );
                      setValue(
                        "automaticFillVariables.firmware",
                        variable?.[0]
                      );
                    }}
                  >
                    <option>Selecione uma variável</option>
                    {availableVariables.map(([key]) => (
                      <option key={key} value={key} id={key}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Qual o firmware?
                  </label>
                  <select
                    className="w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 sm:max-w-md"
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const firmware = firmwares.find(
                        (v) => v.id === selectedId
                      );
                      setValue("firmware", firmware);
                    }}
                  >
                    <option>Selecione um firmware</option>
                    {firmwares.map((firmware) => (
                      <option
                        key={firmware.id}
                        value={firmware.id}
                        id={firmware.id}
                      >
                        {firmware.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {variablesToBeInserted.length > 0 ? (
              <div className="sm:col-span-full">
                <p className="text-sm text-gray-700">
                  Preencha as variáveis do comando.
                </p>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="name"
                    className="mt-2 block text-sm font-medium leading-6 text-gray-900"
                  >
                    Variáveis
                  </label>
                  <div className="mt-2 space-y-2">
                    {variablesToBeInserted.map(([key]) => (
                      <div key={key} className="flex gap-2">
                        <div
                          key={key}
                          className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600"
                        >
                          <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                            {key}:
                          </span>
                          <input
                            {...register(`variablesToBeInserted.${key}`)}
                            type="text"
                            id="name"
                            autoComplete="name"
                            className="border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="#00"
                          />
                        </div>
                        {/* <Button type="button" variant="outline">
                          É o imei?
                        </Button> */}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}

            <div className="sm:col-span-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Preview dos comandos que serão enviados
              </label>
              <ul className="mt-2">
                {preview.map((p, i) => (
                  <li key={i} className="text-sm leading-6 text-gray-600">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancelar
        </button>
        <Button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
