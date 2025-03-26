"use client";
import { Controller } from "react-hook-form";
import { IFirmware } from "@/app/lib/@backend/domain";
import { FileUpload } from "../../../../component/input-file";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import { useFirmwareUpdateForm } from "./use-firmware-update-form";

interface Props {
  firmware: IFirmware;
}

export function FirmwareUpdateForm(props: Props) {
  const { firmware } = props;
  const { register, handleSubmit, control } = useFirmwareUpdateForm({
    defaultValues: firmware,
  });

  return (
    <form action={() => handleSubmit()}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nome
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    Firmware:
                  </span>
                  <input
                    {...register("name")}
                    type="text"
                    id="name"
                    autoComplete="name"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="#00"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Nome no equipamento
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <input
                    {...register("name_in_device")}
                    type="text"
                    id="name_in_device"
                    autoComplete="name_in_device"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="ET-ota.pack"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Versão
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                    v:
                  </span>
                  <input
                    {...register("version")}
                    type="text"
                    id="version"
                    autoComplete="version"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="2.0.1"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Descrição
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                  {...register("description")}
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                Escreva um pouco sobre a ordem de produção.
              </p>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Arquivo Atual
              </label>
              <Button className="mt-2" variant="outline">
                <a href={firmware.file.url} download={firmware.name}>
                  Baixar firmware {firmware.file.name}
                </a>
              </Button>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Deseja substituir esse firmware?
              </label>
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <FileUpload
                    multiple={false}
                    accept=".pack"
                    handleFile={(f) => f?.[0] && field.onChange(f?.[0])}
                    element={({ upload, files, removeFile }) => (
                      <>
                        <Button
                          type="button"
                          onClick={upload}
                          variant={"outline"}
                          className="mt-2"
                        >
                          Escolher firmware
                        </Button>
                        <ul className="mt-2">
                          {files.map((file, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center"
                            >
                              <span>
                                {file.name} -{" "}
                                {(file.size / 1024 / 1024).toFixed(5)} MB
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-4 text-red-600 hover:text-red-800"
                              >
                                Remover
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  />
                )}
              />
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
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
