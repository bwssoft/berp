"use client";

import { Device, ITechnology } from "@/app/lib/@backend/domain";
import { Button, Spinner } from "@/app/lib/@frontend/ui/component";

import { useAutoTest } from "@/app/lib/@frontend/hook/use-auto-test";
import { TechnologySearchForm } from "@/app/lib/@frontend/ui/form/production/technology-search";
import { DevicesDetectedTable } from "@/app/lib/@frontend/ui/table/production/devices-detected/table";
import { DevicesAutoTestedTable } from "@/app/lib/@frontend/ui/table/production/devices-auto-tested/table";

interface Props {
  technology: ITechnology | null;
}
export function AutoTestPanel(props: Props) {
  const { technology } = props;

  const { detected, autoTest, test, requestPort, progress } = useAutoTest({
    technology,
  });

  return (
    <>
      <div className="mt-10 flex flex-col gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <div className="border-b border-gray-900/10 pb-6">
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Etapa 1: Definição da tecnologia
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Escolha a technologia para o auto teste
            </p>
          </div>
          <div className="mt-6">
            <TechnologySearchForm technology={technology} />
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <div className="border-b border-gray-900/10 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-base font-semibold leading-7 text-gray-900">
                  Etapa 2: Portas
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Uma lista de todas as portas conectadas vinculadas ao
                  equipamento identificado
                </p>
              </div>
              {progress.detection && <Spinner />}
            </div>
          </div>
          <div className="mt-6">
            {technology && (
              <DevicesDetectedTable
                data={detected}
                model={Device.Model[technology.name.system as Device.Model]}
              />
            )}
            <div className="mt-6 flex justify-between gap-2">
              <Button
                variant="default"
                className="h-fit bg-blue-600 hover:bg-blue-500"
                onClick={() => test()}
              >
                Auto Test{" "}
              </Button>

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
      </div>
      <div className="mt-10 flex flex-col gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-md p-6">
          <div className="border-b border-gray-900/10 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-base font-semibold leading-7 text-gray-900">
                  Etapa 3: Verificação
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Uma lista de todos os equipamentos testados.
                </p>
              </div>
              {progress.autoTest && <Spinner />}
            </div>
          </div>
          <div className="mt-6">
            <DevicesAutoTestedTable data={autoTest} />
          </div>
        </div>
      </div>
    </>
  );
}
