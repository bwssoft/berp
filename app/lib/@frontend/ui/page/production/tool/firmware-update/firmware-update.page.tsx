"use client";

import { Device, type ITechnology } from "@/app/lib/@backend/domain";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component/card";
import { Badge } from "@/app/lib/@frontend/ui/component/badge";
import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { TechnologySearchForm } from "@/app/lib/@frontend/ui/form";
import {
  Settings,
  Zap,
  CheckCircle,
  Plus,
  Loader2,
  Pause,
  Play,
} from "lucide-react";
import { DevicesDetectedTable } from "@/app/lib/@frontend/ui/table/production/devices-detected/table";
import { useFirmwareUpdate } from "./use-firmware-update";
import { DevicesUpdatedFirmwareTable } from "../../../../table/production/devices-updated-firmware/table";

interface Props {
  technology: ITechnology | null;
}

export function FirmwareUpdatePage(props: Props) {
  const { technology } = props;

  const {
    detected,
    updated,
    update,
    requestPort,
    isUpdating,
    isDetecting,
    toDetect,
    setToDetect,
  } = useFirmwareUpdate({
    technology,
  });

  const date = new Date();
  const hasRecorded = updated.length > 0;

  return (
    <>
      <div className="container mx-auto pb-8 px-4 space-y-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Gravação de Firmware
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Ferramenta para requisitar a atualização de firmware em{" "}
            <span className="text-gray-900">equipamentos IoT.</span> Data de
            hoje:{" "}
            <time dateTime={date.toLocaleDateString()}>
              {date.toLocaleDateString()}
            </time>
          </p>
        </div>

        {/* Etapa 1: Tecnologia e Perfil */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Badge
                variant="default"
                className="w-8 h-8 rounded-full flex items-center justify-center p-0"
              >
                1
              </Badge>
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">
                  Definição da tecnologia
                </CardTitle>
              </div>
            </div>
            <CardDescription className="ml-11">
              Escolha a tecnologia dos equipamentos
            </CardDescription>
          </CardHeader>
          <CardContent className="ml-11">
            <TechnologySearchForm technology={technology} />
          </CardContent>
        </Card>

        {/* Etapa 2: Portas */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Badge
                  variant="default"
                  className="w-8 h-8 rounded-full flex items-center justify-center p-0"
                >
                  2
                </Badge>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">
                    Gerenciamento de Portas
                  </CardTitle>
                </div>
              </div>
              <Button onClick={() => setToDetect((prev) => !prev)}>
                {toDetect ? <Pause /> : <Play />}
              </Button>
            </div>
            <CardDescription className="ml-11">
              Visualize os equipamentos conectados às portas seriais
            </CardDescription>
          </CardHeader>
          {technology ? (
            <CardContent className="ml-11 space-y-6">
              <div className="rounded-lg border">
                <DevicesDetectedTable
                  data={detected}
                  model={Device.Model[technology.name.system as Device.Model]}
                />
              </div>

              <Separator />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => detected.length > 0 && update(detected)}
                    disabled={
                      detected.length === 0 || isDetecting || isUpdating
                    }
                    className="min-w-[140px] flex items-center justify-center"
                  >
                    {isDetecting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Detectando
                      </>
                    ) : isUpdating ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Atualizando
                      </>
                    ) : (
                      <>
                        <Settings className="mr-2 h-4 w-4" />
                        Atualizar
                      </>
                    )}
                  </Button>

                  {!technology && (
                    <p className="text-sm text-muted-foreground self-center">
                      Selecione uma tecnologia para continuar
                    </p>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={requestPort}
                  className="min-w-[140px]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Porta
                </Button>
              </div>
            </CardContent>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhuma tecnologia selecionada
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Complete as etapas anteriores para visualizar os equipamentos
                detectados.
              </p>
            </div>
          )}
        </Card>

        {/* Etapa 3: Verificação */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Badge
                variant={hasRecorded ? "default" : "secondary"}
                className="w-8 h-8 rounded-full flex items-center justify-center p-0"
              >
                3
              </Badge>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`h-5 w-5 ${hasRecorded ? "text-primary" : "text-muted-foreground"}`}
                />
                <CardTitle className="text-xl">
                  Verificação e Resultados
                </CardTitle>
              </div>
            </div>
            <CardDescription className="ml-11">
              {hasRecorded
                ? `${updated.length} equipamento(s) gravado(s) com sucesso`
                : "Aguardando gravação dos equipamentos"}
            </CardDescription>
          </CardHeader>
          {technology ? (
            <CardContent className="ml-11">
              {hasRecorded ? (
                <div className="rounded-lg border">
                  <DevicesUpdatedFirmwareTable
                    data={updated}
                    model={Device.Model[technology.name.system as Device.Model]}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Nenhum equipamento gravado
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Complete as etapas anteriores para visualizar os
                    equipamentos gravados.
                  </p>
                </div>
              )}
            </CardContent>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhuma tecnologia selecionada
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Complete as etapas anteriores para visualizar os equipamentos
                gravados.
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
