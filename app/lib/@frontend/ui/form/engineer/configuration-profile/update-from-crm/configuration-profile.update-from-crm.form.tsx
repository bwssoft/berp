"use client";

import { configurationProfileConstants } from "@/app/lib/constant";
import { useConfigurationProfileUpdateFromCrmForm } from "./use-configuration-profile.update-from-crm.form";
import {
  IClient,
  IConfigurationProfile,
  ITechnology,
} from "@/app/lib/@backend/domain";
import { Button } from "../../../../component";
import { ShareIcon } from "@heroicons/react/24/outline";
import { generateConfigurationProfileLinkForClient } from "../util";

interface Props {
  client: IClient;
  technologies: ITechnology[];
  configurationProfile: IConfigurationProfile;
  technology: ITechnology;
}

export function ConfigurationProfileUpdateFromCrmForm(props: Props) {
  const { client, technologies, configurationProfile, technology } = props;
  const { register, handleChangeName, handleSubmit } =
    useConfigurationProfileUpdateFromCrmForm({
      defaultValues: configurationProfile,
      client,
      technology,
    });

  return (
    <form action={() => handleSubmit()}>
      <section aria-labelledby="identification">
        <div className="bg-white sm:rounded-lg">
          <div className="py-5">
            <p className="text-sm font-medium text-gray-900">Identificação</p>
            <p className="mt-2 text-sm text-gray-700">
              Informações para identificar o perfil que está sendo criado.
            </p>
          </div>
          <div className="border-t border-gray-200 py-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="client_id"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Cliente
                </label>
                <p
                  id="client_id"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  {client.company_name ?? client.trade_name} -{" "}
                  {client.document.value}
                </p>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tipo
                </label>
                <select
                  id="type"
                  {...register("type")}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    const selectedOption =
                      e.target.options[e.target.selectedIndex];
                    const type = selectedOption.getAttribute("value") as string;
                    handleChangeName({ type });
                  }}
                >
                  <option value="">Selecione um tipo</option>
                  {Object.entries(configurationProfileConstants.type).map(
                    ([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    )
                  )}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="technology_id"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tecnologia
                </label>
                <select
                  id="technology_id"
                  {...register("technology_id")}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    const selectedOption =
                      e.target.options[e.target.selectedIndex];
                    const technology = selectedOption.getAttribute(
                      "brand-name"
                    ) as string;
                    handleChangeName({ technology });
                  }}
                >
                  <option value="">Selecione uma tecnologia</option>
                  {technologies.map((tech) => (
                    <option
                      key={tech.id}
                      value={tech.id}
                      brand-name={tech.name.brand}
                    >
                      {tech.name.brand}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section aria-labelledby="communication">
        <div className="bg-white sm:rounded-lg">
          <div className="py-5">
            <p className="text-sm font-medium text-gray-900">
              Comunicação e rede
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Informações para configurar como o equipamento irá se comunicar
            </p>
          </div>
          <div className="border-t border-gray-200 py-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
              {/* SENHA */}
              <div className="sm:col-span-3">
                <dt className="block text-sm font-medium leading-6 text-gray-600">
                  Senha do Dispositivo
                </dt>
                <div className="flex w-full gap-2 mt-2">
                  <div className="flex-1">
                    <label
                      htmlFor="old_password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Senha antiga
                    </label>
                    <input
                      {...register("password.old")}
                      id="old_password"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="000000"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="new_password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nova senha
                    </label>
                    <input
                      {...register("password.new")}
                      id="new_password"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="123456"
                    />
                  </div>
                </div>
              </div>

              {/* APN */}
              <div className="sm:col-span-5">
                <dt className="block text-sm font-medium leading-6 text-gray-600">
                  APN
                </dt>
                <div className="flex w-full gap-2 mt-2">
                  <div className="flex-1">
                    <label
                      htmlFor="apn_address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      APN
                    </label>
                    <input
                      {...register("apn.address")}
                      id="apn_address"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="bws.br"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="apn_address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Usuário
                    </label>
                    <input
                      {...register("apn.user")}
                      id="apn_address"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="bws"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="apn_password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Senha
                    </label>
                    <input
                      {...register("apn.password")}
                      id="apn_password"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="bws"
                    />
                  </div>
                </div>
              </div>

              {/* IP */}
              <div className="sm:col-span-4">
                <dt className="block text-sm font-medium leading-6 text-gray-600">
                  IP
                </dt>
                <div className="flex w-full gap-2 mt-2">
                  <div className="flex-1">
                    <label
                      htmlFor="primary_ip"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      IP Primário
                    </label>
                    <input
                      {...register("ip.primary.ip")}
                      id="primary_ip"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="127.0.0.1"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="primary_ip_port"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Porta Primária
                    </label>
                    <input
                      {...register("ip.primary.port")}
                      id="primary_ip_port"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="3000"
                    />
                  </div>
                </div>
                <div className="flex w-full gap-2 mt-4">
                  <div className="flex-1">
                    <label
                      htmlFor="secondary_ip"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      IP Secundário
                    </label>
                    <input
                      {...register("ip.secondary.ip")}
                      id="secondary_ip"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="127.0.0.1"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="secondary_ip_port"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Porta Secundária
                    </label>
                    <input
                      {...register("ip.secondary.port")}
                      id="secondary_ip_port"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="3001"
                    />
                  </div>
                </div>
              </div>

              {/* DNS */}
              <div className="sm:col-span-4">
                <dt className="block text-sm font-medium leading-6 text-gray-600">
                  DNS
                </dt>
                <div className="flex w-full gap-2 mt-2">
                  <div className="flex-1">
                    <label
                      htmlFor="dns_address"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      DNS
                    </label>
                    <input
                      {...register("dns.address")}
                      id="dns_address"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="bwfleets.com"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="dns_port"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Porta
                    </label>
                    <input
                      {...register("dns.port")}
                      id="dns_port"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="3000"
                    />
                  </div>
                </div>
              </div>

              {/* DATA TRANSMISSION */}
              <div className="sm:col-span-5">
                <dt className="block text-sm font-medium leading-6 text-gray-600">
                  Intervalo de transmissão
                </dt>
                <div className="flex w-full gap-2 mt-2">
                  <div className="flex-1">
                    <label
                      htmlFor="data_transmission.on"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ligado (Segundos)
                    </label>
                    <input
                      {...register("data_transmission.on")}
                      id="data_transmission.on"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="60"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="data_transmission.off"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Desligado (Segundos)
                    </label>
                    <input
                      id="data_transmission.off"
                      {...register("data_transmission.off")}
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="7200"
                    />
                  </div>
                </div>
              </div>

              {/* KEEP ALIVE */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="keep_alive"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Keep Alive (Minutos)
                </label>
                <input
                  type="text"
                  id="keep_alive"
                  {...register("keep_alive")}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="60"
                />
              </div>

              {/* TIMEZONE */}
              <div className="sm:col-span-3">
                <label
                  htmlFor="timezone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Fuso horário
                </label>
                <select
                  id="timezone"
                  {...register("timezone")}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Selecione um fuso horário</option>
                  {configurationProfileConstants.timezones.map(
                    ({ label, value }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-start gap-x-6">
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

        <Button
          variant="link"
          type="submit"
          className="ml-auto flex items-center"
          onClick={() =>
            generateConfigurationProfileLinkForClient(configurationProfile.id)
          }
        >
          <ShareIcon className="size-4" />
          <p>Gerar link para o cliente preencher</p>
        </Button>
      </div>
    </form>
  );
}
