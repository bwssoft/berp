"use client";

import { configurationProfileConstants } from "@/app/lib/constant";
import { useConfigurationProfileUpdateFromProductionOrderForm } from "./use-configuration-profile.update-from-production-order.form";
import {IClient} from "@/app/lib/@backend/domain/commercial/entity/client.definition";
import {IConfigurationProfile} from "@/app/lib/@backend/domain/engineer/entity/configuration-profile.definition";
import {ITechnology} from "@/app/lib/@backend/domain/engineer/entity/technology.definition";
import {} from "@/app/lib/@backend/domain/admin/entity/control.definition";
import { Button } from '@/frontend/ui/component/button';


interface Props {
  productionOrderId: string;
  lineItemId: string;
  configurationProfile: IConfigurationProfile;
  client: IClient;
  technology: ITechnology;
}

export function ConfigurationProfileUpdateFromProductionOrderForm(
  props: Props
) {
  const { configurationProfile, client, technology } = props;
  const { register, handleChangeName, handleSubmit } =
    useConfigurationProfileUpdateFromProductionOrderForm({
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
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                <p
                  id="technology_id"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                >
                  {technology.name.brand}
                </p>
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
                      {...register("config.general.apn.address")}
                      id="apn_address"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.apn.user")}
                      id="apn_address"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.apn.password")}
                      id="apn_password"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.ip_primary.ip")}
                      id="primary_ip"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.ip_primary.port")}
                      id="primary_ip_port"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.ip_secondary.ip")}
                      id="secondary_ip"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.ip_secondary.port")}
                      id="secondary_ip_port"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.dns_primary.address")}
                      id="dns_address"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.dns_primary.port")}
                      id="dns_port"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.data_transmission_on")}
                      id="data_transmission.on"
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                      {...register("config.general.data_transmission_off")}
                      className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
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
                  {...register("config.general.keep_alive")}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  placeholder="60"
                />
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
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
