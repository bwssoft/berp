"use client";

import { ITechnology } from "@/app/lib/@backend/domain";
import { Button } from "@/app/lib/@frontend/ui/component";
import {
  DevicesAutoTestedTable,
  DevicesToAutoTestTable,
} from "@/app/lib/@frontend/ui/table";
import { useAutoTest } from "@/app/lib/@frontend/hook";
import { TechnologySearchForm } from "@/app/lib/@frontend/ui/form/production/technology-search";

interface Props {
  technology: ITechnology | null;
}
export function AutoTestPanel(props: Props) {
  const { technology } = props;

  const { identified, autotest, handleAutoTest, requestPort } = useAutoTest({
    technology,
  });

  return (
    <>
      <div className="mt-10 flex flex-col gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Etapa 1: Definição da tecnologia
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Escolha a technologia para o auto teste
          </p>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <TechnologySearchForm technology={technology} />
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
            <DevicesToAutoTestTable
              data={identified.map((i) => ({
                imei: i.equipment.imei,
                iccid: i.equipment.iccid,
                et: i.equipment.et,
                port: i.port,
              }))}
            />
          </div>
          <div className="flex justify-between gap-2">
            <div className="flex gap-2">
              <Button
                variant="default"
                className="h-fit bg-indigo-600 hover:bg-indigo-500"
                onClick={() => handleAutoTest()}
              >
                Auto Test{" "}
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
            Uma lista de todos os equipamentos testados.
          </p>
        </div>
        <DevicesAutoTestedTable data={autotest} />
      </div>
    </>
  );
}
