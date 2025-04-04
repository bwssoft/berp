"use client";

import { ITechnology } from "@/app/lib/@backend/domain";
import { Button, Input } from "@/app/lib/@frontend/ui/component";
import {
  IdentificationForm,
  TechnologySearchForm,
} from "@/app/lib/@frontend/ui/form";
import {
  DevicesDetectedTable,
  DevicesIdentifiedTable,
} from "@/app/lib/@frontend/ui/table";
import { useIdentification } from "@/app/lib/@frontend/hook";

interface Props {
  technology: ITechnology | null;
}
export function IdentificationPanel(props: Props) {
  const { technology } = props;

  const { identified, process, identify, requestPort } = useIdentification({
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
            Escolha a technologia para o processo de escrita do identificador
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
            <DevicesDetectedTable data={identified} />
          </div>
          <div className="flex justify-between gap-2">
            <IdentificationForm onSubmit={identify} disabled={false} />
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
            Uma lista de todos os equipamentos identificados.
          </p>
        </div>
        <DevicesIdentifiedTable data={process} />
      </div>
    </>
  );
}
