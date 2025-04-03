import { useFormContext } from "react-hook-form";
import { ConfigurationProfileSchema } from "../create/use-configuration-profile.create.form";

export function GeneralConfigurationProfileForm() {
  const { register } = useFormContext<ConfigurationProfileSchema>();

  return (
    <section aria-labelledby="general-config" className="space-y-8">
      {/* Cabeçalho */}
      <div className="pb-6 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">Configuração Gerais</h3>
        <p className="mt-1 text-sm text-gray-600">
          Configure como o equipamento irá se comunicar com a rede e transmitir
          dados
        </p>
      </div>

      {/* 1. Configurações Básicas de Rede */}
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Rede</h3>
        {/* APN */}
        <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-6">
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Configuração APN
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="apn_address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  APN
                </label>
                <input
                  {...register("config.general.apn.address")}
                  id="apn_address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="bws.br"
                />
              </div>
              <div>
                <label
                  htmlFor="apn_user"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Usuário
                </label>
                <input
                  {...register("config.general.apn.user")}
                  id="apn_user"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="bws"
                />
              </div>
              <div>
                <label
                  htmlFor="apn_password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Senha
                </label>
                <input
                  {...register("config.general.apn.password")}
                  id="apn_password"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="bws"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Configurações de IP */}
        <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Ip Primário
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="primary_ip"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Endereço IP
                </label>
                <input
                  {...register("config.general.ip_primary.ip")}
                  id="primary_ip"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="127.0.0.1"
                />
              </div>
              <div>
                <label
                  htmlFor="primary_ip_port"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Porta
                </label>
                <input
                  {...register("config.general.ip_primary.port")}
                  id="primary_ip_port"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="3000"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Ip Secundário
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="secondary_ip"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Endereço IP
                </label>
                <input
                  {...register("config.general.ip_secondary.ip")}
                  id="secondary_ip"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="127.0.0.1"
                />
              </div>
              <div>
                <label
                  htmlFor="secondary_ip_port"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Porta
                </label>
                <input
                  {...register("config.general.ip_secondary.port")}
                  id="secondary_ip_port"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="3001"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Configurações de DNS */}
        <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              DNS Primário
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dns_primary_address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Endereço
                </label>
                <input
                  {...register("config.general.dns_primary.address")}
                  id="dns_primary_address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="bwfleets.com"
                />
              </div>
              <div>
                <label
                  htmlFor="dns_primary_port"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Porta
                </label>
                <input
                  {...register("config.general.dns_primary.port")}
                  id="dns_primary_port"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="3000"
                />
              </div>
            </div>
          </div>

          <div className="sm:col-span-3">
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              DNS Secundário
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="dns_secondary_address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Endereço
                </label>
                <input
                  {...register("config.general.dns_secondary.address")} // Corrigido para secondary
                  id="dns_secondary_address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="bwfleets.com"
                />
              </div>
              <div>
                <label
                  htmlFor="dns_secondary_port"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Porta
                </label>
                <input
                  {...register("config.general.dns_secondary.port")} // Corrigido para secondary
                  id="dns_secondary_port"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="3000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Configurações de Transmissão */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">
          Configurações de Transmissão
        </h3>

        <div className="grid grid-cols-1 gap-y-4 gap-x-6 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="data_transmission_on"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Intervalo Ligado (s)
                </label>
                <input
                  {...register("config.general.data_transmission_on")}
                  id="data_transmission_on"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="60"
                />
              </div>
              <div>
                <label
                  htmlFor="data_transmission_off"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Intervalo Desligado (s)
                </label>
                <input
                  {...register("config.general.data_transmission_off")}
                  id="data_transmission_off"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="7200"
                />
              </div>
              <div>
                <label
                  htmlFor="keep_alive"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Keep Alive (min)
                </label>
                <input
                  {...register("config.general.keep_alive")}
                  id="keep_alive"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="60"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
