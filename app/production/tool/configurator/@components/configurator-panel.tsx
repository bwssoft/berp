"use client";

import { IConfigurationProfile, ITechnology } from "@/app/lib/@backend/domain";
import { Button } from "@/app/lib/@frontend/ui/component";
import { TechnologyAndConfigurationProfileSearchForm } from "@/app/lib/@frontend/ui/form";
import {
  DevicesConfiguredTable,
  DevicesDetectedTable,
} from "@/app/lib/@frontend/ui/table";
import { useConfiguration } from "@/app/lib/@frontend/hook";

interface Props {
  configurationProfile: IConfigurationProfile | null;
  technology: ITechnology | null;
}
export function ConfiguratorPanel(props: Props) {
  const { configurationProfile, technology } = props;

  const { identified, configured, configure, requestPort } = useConfiguration({
    technology,
  });
  return (
    <>
      <div className="mt-10 flex flex-col gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Etapa 1: Definição da tecnologia e perfil de configuração
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Escolha a technologia e o perfil de configuração
          </p>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <TechnologyAndConfigurationProfileSearchForm
            configurationProfile={configurationProfile}
            technology={technology}
          />
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Etapa 2: Portas
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todas as portas conectadas vinculadas ao equipamento
            identificado
          </p>
        </div>
        <div className="border-b border-gray-900/10 pb-12 flex flex-col gap-6 w-full">
          <div className="flow-root w-full">
            <DevicesDetectedTable data={identified} />
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="default"
                className="h-fit bg-blue-600 hover:bg-blue-500"
                onClick={() => configure(configurationProfile)}
              >
                Configurar{" "}
                {/* {isConfigurationDisabled && `(${configurationDisabledTimer})`} */}
              </Button>
            </div>

            <Button
              variant="outline"
              className="h-fit whitespace-nowrap "
              onClick={requestPort}
            >
              Nova Porta
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Etapa 3: Verificação
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todos os equipamentos configurados e os comandos
            enviados.
          </p>
        </div>
        <DevicesConfiguredTable data={configured} />
      </div>
    </>
  );
}
