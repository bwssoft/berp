"use client";

import { configurationProfileConstants } from "@/app/lib/constant";
import { useConfigurationProfileCreateForm } from "./use-configuration-profile.create.form";
import { IClient, ITechnology } from "@/app/lib/@backend/domain";
import { Button } from "../../../../component";
import { GeneralConfigurationProfileForm } from "../config/general.configuration-profile.form";
import { SpecificE3Plus4GConfigurationProfileForm } from "../config/specific.e3-plus-4g.configuration-profile.form";
import { Controller, FormProvider } from "react-hook-form";

interface Props {
  clients: IClient[];
  technologies: ITechnology[];
}

export function ConfigurationProfileCreateForm(props: Props) {
  const { clients, technologies } = props;
  const { methods, register, handleChangeName, handleSubmit, technology } =
    useConfigurationProfileCreateForm(props);

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Seção de Identificação */}
        <div className="pb-6 border-b border-gray-200">
          <h2 className="font-medium text-gray-900">Identificação do Perfil</h2>
          <p className="mt-1 text-sm text-gray-600">
            Informações básicas para identificar o perfil de configuração
          </p>
        </div>
        <section className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            Dados gerais
          </h3>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            {/* Cliente */}
            <Controller
              control={methods.control}
              name="client_id"
              render={({ field }) => (
                <div className="sm:col-span-2">
                  <label
                    htmlFor="client_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Cliente
                  </label>
                  <select
                    id="client_id"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    onChange={(e) => {
                      field.onChange(e);
                      const document = e.target.options[
                        e.target.selectedIndex
                      ].getAttribute("data-client") as string;
                      handleChangeName({ document });
                    }}
                  >
                    <option value="">Selecione um cliente</option>
                    {clients.map((c) => (
                      <option
                        key={c.id}
                        value={c.id}
                        data-client={c.document.value}
                      >
                        {c.company_name ?? c.trade_name} - {c.document.value}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />

            {/* Caso de Uso */}
            <div className="sm:col-span-2">
              <label
                htmlFor="use_case"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Caso de Uso
              </label>
              <select
                id="use_case"
                {...register("use_case")}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
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

            {/* Tipo */}
            <Controller
              control={methods.control}
              name="type"
              render={({ field }) => (
                <div className="sm:col-span-2">
                  <label
                    htmlFor="type"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tipo
                  </label>
                  <select
                    id="type"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    onChange={(e) => {
                      field.onChange(e);
                      const type = e.target.options[
                        e.target.selectedIndex
                      ].getAttribute("value") as string;
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
              )}
            />

            {/* Tecnologia */}
            <Controller
              control={methods.control}
              name="technology_id"
              render={({ field }) => (
                <div className="sm:col-span-2">
                  <label
                    htmlFor="technology_id"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tecnologia
                  </label>
                  <select
                    id="technology_id"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 border"
                    onChange={(e) => {
                      field.onChange(e);
                      const technology = e.target.options[
                        e.target.selectedIndex
                      ].getAttribute("brand-name") as string;
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
              )}
            />
          </div>
        </section>

        {/* Formulários de Configuração */}
        <GeneralConfigurationProfileForm />
        {technology?.name.system === "DM_E3_PLUS_4G" ? (
          <SpecificE3Plus4GConfigurationProfileForm />
        ) : (
          <></>
        )}

        {/* Ações do Formulário */}
        <div className="mt-8 flex items-center justify-end gap-x-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <Button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Salvar Perfil
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
