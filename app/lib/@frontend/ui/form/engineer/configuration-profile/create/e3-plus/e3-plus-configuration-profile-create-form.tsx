"use client";

import {
  accelerometerSensitivity,
  economyMode,
  functions,
  lockType,
  optional_functions,
  timezones,
  workMode,
} from "@/app/lib/constant/configuration-profile-e3-plus";
import { useE3PlusConfigurationProfileCreateForm } from "./use-e3-plus-configuration-profile-create-form";
import { Controller } from "react-hook-form";
import { Alert, Button, Input, Radio, Select, Toggle } from "@/app/lib/@frontend/ui/component";
import { configurationProfileConstants } from "@/app/lib/constant";
import { IClient } from "@/app/lib/@backend/domain";

interface Props {
  clients: IClient[]
}

export function E3PlusConfigurationProfileCreateForm(props: Props) {
  const { clients } = props
  const {
    register,
    ipdns,
    handleChangeIpDns,
    handleSubmit,
    control,
    errors,
    reset,
  } = useE3PlusConfigurationProfileCreateForm();
  return (
    <form
      autoComplete="off"
      className="flex flex-col gap-6 mt-6"
      onSubmit={handleSubmit}
    >
      <section aria-labelledby="general">
        <div className="bg-white sm:rounded-lg">
          <div className="py-5">
            <h1
              id="applicant-information-title"
              className="text-base font-semibold leading-7 text-gray-900"
            >
              Perfil de configuração
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Insira o nome do perfil.
            </p>
          </div>
          <div className="border-t border-gray-200 py-5">
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="client_id"
                  className="block text-sm font-medium leading-6 text-gray-900"
                  >
                  Cliente
                </label>
                <select
                  id="client_id"
                  {...register("client_id")}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      data-client={JSON.stringify(c)}
                    >
                      {c.trade_name} - {c.document.value}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                  >
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  autoComplete="name"
                  {...register("name")}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Nome do perfil"
                />
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="client_id"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Caso de uso
                </label>
                <select
                  id="use_case"
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  {...register("use_case")}
                >
                  <option value="">Selecione um caso de uso</option>
                  {Object.entries(configurationProfileConstants.useCase).map(
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
                  htmlFor="type"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tipo
                </label>
                <select
                  id="type"
                  {...register("type")}
                  className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="communication">
        <div className="bg-white sm:rounded-lg">
          <div className="py-5">
            <h1
              id="applicant-information-title"
              className="text-base font-semibold leading-7 text-gray-900"
            >
              Comunicação
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Detalhes do equipamento e suas configurações.
            </p>
          </div>
          <div className="border-t border-gray-200 py-5">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-400">
                  Senha do Dispositivo
                </dt>
                <div className="flex gap-2 mt-2">
                  <Input
                    {...register("password.old")}
                    id="old_password"
                    label="Antiga"
                    placeholder="000000"
                    error={errors?.password?.old?.message}
                  />
                  <Input
                    {...register("password.new")}
                    id="new_password"
                    label="Nova"
                    placeholder="123456"
                    error={errors?.password?.new?.message}
                  />
                </div>
              </div>
              <div className="sm:col-span-full">
                <dt className="text-sm font-medium text-gray-400">APN</dt>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="addres"
                    label="Endereço"
                    placeholder="bws.br"
                    {...register("apn.address")}
                  />
                  <Input
                    id="apn_user"
                    label="Usuário"
                    placeholder="usuario"
                    {...register("apn.user")}
                  />
                  <Input
                    id="apn_password"
                    label="Senha"
                    placeholder="123456"
                    {...register("apn.password")}
                  />
                </div>
              </div>
              <div className="sm:col-span-full">
                <dt className="text-sm font-medium text-gray-400">
                  Configurações de Rede
                </dt>
                <div className="mt-2">
                  <Radio
                    data={[{ value: "IP" }, { value: "DNS" }]}
                    keyExtractor={(d) => d.value}
                    valueExtractor={(d) => d.value}
                    name="ip_dns"
                    label="IP ou DNS"
                    onChange={({ value }) =>
                      handleChangeIpDns(value as "IP" | "DNS")
                    }
                    defaultValue={{ value: "IP" }}
                  />
                </div>
              </div>
              {ipdns === "IP" && (
                <div className="sm:col-span-full">
                  <div className="flex gap-2">
                    <div className="flex gap-2">
                      <Input
                        id="primary_ip"
                        label="IP"
                        placeholder="124.451.451.12"
                        {...register("ip.primary.ip")}
                        error={errors?.ip?.primary?.ip?.message}
                      />
                      <Input
                        id="primary_ip_port"
                        label="Porta"
                        placeholder="2000"
                        type="number"
                        {...register("ip.primary.port")}
                        error={errors?.ip?.primary?.port?.message}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_ip"
                        label="IP"
                        placeholder="124.451.451.12"
                        {...register("ip.secondary.ip")}
                        error={errors?.ip?.secondary?.ip?.message}
                      />
                      <Input
                        id="secondary_ip_port"
                        label="Porta"
                        placeholder="2000"
                        type="number"
                        {...register("ip.secondary.port")}
                        error={errors?.ip?.secondary?.port?.message}
                      />
                    </div>
                  </div>
                </div>
              )}
              {ipdns === "DNS" && (
                <div className="sm:col-span-full">
                  <div className="flex gap-2">
                    <Input
                      id="dns_address"
                      label="Endereço"
                      placeholder="dns.btrace.easytrack"
                      {...register("dns.address")}
                    />
                    <Input
                      id="dns_port"
                      label="Porta"
                      placeholder="2000"
                      type="number"
                      {...register("dns.port")}
                      error={errors?.dns?.port?.message}
                    />
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="general-config">
        <div className="bg-white sm:rounded-lg">
          <div className="py-5">
            <h1
              id="applicant-information-title"
              className="text-base font-semibold leading-7 text-gray-900"
            >
              Configurações Gerais
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Detalhes do equipamento e suas configurações.
            </p>
          </div>
          <div className="border-t border-gray-200 py-5">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-full">
                <dt className="text-sm font-medium text-gray-400">
                  Intervalo de Transmissão
                </dt>
                <div className="flex gap-2 mt-2">
                  <Input
                    {...register("data_transmission.on")}
                    id="transmission_on"
                    label="Monitorado Ligado (Segundos)"
                    placeholder="60"
                    type="number"
                    error={errors.data_transmission?.on?.message}
                  />
                  <Input
                    {...register("data_transmission.off")}
                    id="transmission_off"
                    label="Monitorado Desligado (Segundos)"
                    placeholder="180"
                    type="number"
                    error={errors.data_transmission?.off?.message}
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <Controller
                  control={control}
                  name="accelerometer_sensitivity"
                  render={({ field }) => (
                    <Select
                      name="accelerometer_sensitivity"
                      data={accelerometerSensitivity}
                      keyExtractor={(d) => d.value}
                      valueExtractor={(d) => d.label}
                      label="Sensibilidade do acelerômetro"
                      value={accelerometerSensitivity.find(
                        (d) => d.value === field.value
                      )}
                      onChange={(d) => field.onChange(d.value)}
                    />
                  )}
                />
              </div>
              <div className="sm:col-span-1">
                <Controller
                  control={control}
                  name="lock_type"
                  render={({ field }) => (
                    <Select
                      name="lock_type"
                      data={lockType}
                      keyExtractor={(d) => d.value}
                      valueExtractor={(d) => d.label}
                      label="Tipo de bloqueio"
                      value={lockType.find((d) => d.value === field.value)}
                      onChange={(d) => field.onChange(d.value)}
                    />
                  )}
                />
              </div>
              <div className="sm:col-span-1">
                <Controller
                  control={control}
                  name="timezone"
                  render={({ field }) => (
                    <Select
                      name="timezone"
                      data={timezones}
                      keyExtractor={(d) => d.value}
                      valueExtractor={(d) => d.label}
                      label="Fuso Horário"
                      value={timezones.find((tz) => tz.value === field.value)}
                      onChange={(d) => field.onChange(d.value)}
                    />
                  )}
                />
              </div>
              <div className="sm:col-span-1">
                <Controller
                  control={control}
                  name="economy_mode"
                  render={({ field }) => (
                    <Select
                      name="economy_mode"
                      data={economyMode}
                      keyExtractor={(d) => d.value}
                      valueExtractor={(d) => d.label}
                      label="Modo de Economia"
                      value={economyMode.find((d) => d.value === field.value)}
                      onChange={(d) => field.onChange(d.value)}
                    />
                  )}
                />
              </div>
              <div className="sm:col-span-1">
                <Input
                  {...register("sensitivity_adjustment")}
                  id="sensibility"
                  label="Ajuste de Sensibilidade"
                  placeholder="500"
                  type="number"
                  error={errors.sensitivity_adjustment?.message}
                />
              </div>
              <div className="sm:col-span-1">
                <Input
                  {...register("keep_alive")}
                  id="keep_alive"
                  label="Tempo Keep Alive (Segundos)"
                  placeholder="60"
                  error={errors.keep_alive?.message}
                />
              </div>
              <div className="sm:col-span-1">
                <Input
                  {...register("odometer")}
                  id="odometer"
                  label="Hodômetro"
                  placeholder="5000"
                  type="number"
                  error={errors.odometer?.message}
                />
              </div>
              <div className="sm:col-span-1">
                <Controller
                  control={control}
                  name="work_mode"
                  render={({ field }) => (
                    <Select
                      name="work_mode"
                      data={workMode}
                      keyExtractor={(d) => d.value}
                      valueExtractor={(d) => d.label}
                      label="Modo de trabalho"
                      value={workMode.find((d) => d.value === field.value)}
                      onChange={(d) => field.onChange(d.value)}
                    />
                  )}
                />
              </div>
              <div className="sm:col-span-1">
                <Input
                  {...register("max_speed")}
                  id="max_speed"
                  label="Velocidade Máxima"
                  placeholder="150"
                  type="number"
                  error={errors.max_speed?.message}
                />
              </div>
              <div className="sm:col-span-1">
                <Input
                  {...register("sleep")}
                  id="sleep"
                  label="Sleep"
                  placeholder="2"
                  type="number"
                  error={errors.sleep?.message}
                />
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="additional-functions">
        <div className="bg-white sm:rounded-lg">
          <div className="py-5">
            <h1
              id="applicant-information-title"
              className="text-base font-semibold leading-7 text-gray-900"
            >
              Funções
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Detalhes do equipamento e suas configurações.
            </p>
          </div>
          <Alert
            title="Essas funções SEMPRE gerarão um comando no momento de configurar."
            variant="ghost"
          />
          <div className="border-t border-gray-200 py-5">
            <div className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {functions.map((func, id) => (
                <div key={id} className="relative flex items-center py-4">

                  <div className="ml-3 flex h-6 items-center gap-2">
                    <Controller
                      control={control}
                      name={func.name as any}
                      render={({ field }) => (
                        <Toggle onChange={field.onChange} value={field.value} />
                      )}
                    />
                  </div>

                  <div className="min-w-0 flex-1 text-sm leading-6 ml-4">
                    <label
                      htmlFor={`functions-${func.name}`}
                      className="select-none font-medium text-gray-900"
                    >
                      {func.label}
                    </label>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="additional-functions-optional">
        <div className="bg-white sm:rounded-lg">
          <div className="py-5">
            <h1
              id="applicant-information-title"
              className="text-base font-semibold leading-7 text-gray-900"
            >
              Funções Opcionais
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Detalhes do equipamento e suas configurações.
            </p>
          </div>
          <Alert
            title="Essas funções APENAS gerarão comandos no momento de configurar se forem habilitadas."
            variant="ghost"
          />
          <div className="border-t border-gray-200 py-5">
            <div className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {optional_functions.map((func, id) => (
                <div key={id} className="relative flex items-center py-4">
                  <div className="flex">
                    <div className="flex h-6 items-center">
                      <input
                        id={func.name}
                        {...register(`optional_functions.${func.name}`)}
                        type="checkbox"
                        aria-describedby="id-description"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                      />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label
                        htmlFor={func.name}
                        className="font-medium text-gray-600"
                      >
                        Ativar comando
                      </label>
                    </div>
                  </div>
                  <div className="ml-3 flex h-6 items-center gap-2">
                    <Controller
                      control={control}
                      name={func.name as any}
                      render={({ field }) => (
                        <Toggle onChange={field.onChange} value={field.value} />
                      )}
                    />
                  </div>
                  <div className="ml-3 min-w-0 flex-1 text-sm leading-6">
                    <label
                      htmlFor={`functions-${func.name}`}
                      className="select-none font-medium text-gray-900"
                    >
                      {func.label}
                    </label>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          onClick={() => reset()}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Limpar
        </button>
        <Button variant="default" type="submit">
          Registrar
        </Button>
      </div>
    </form>
  );
}



