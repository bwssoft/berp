"use client";

import {
  Device,
  IConfigurationLog,
  type IConfigurationProfile,
  type ITechnology,
} from "@/app/lib/@backend/domain";
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
import { TechnologyAndConfigurationProfileSearchForm } from "@/app/lib/@frontend/ui/form";
import {
  Settings,
  Zap,
  CheckCircle,
  Plus,
  Loader2,
  CheckCheckIcon,
} from "lucide-react";
import { Switch } from "@/app/lib/@frontend/ui/component/switch";
import { Label } from "@/app/lib/@frontend/ui/component/label";
import { useCheckConfiguration } from "@/app/lib/@frontend/hook/use-check-configuration";
import { DevicesDetectedTable } from "@/app/lib/@frontend/ui/table/production/devices-detected/table";
import { DevicesCheckedTable } from "@/app/lib/@frontend/ui/table/production/devices-checked/table";

interface Props {
  configurationProfile?: IConfigurationProfile | null;
  configurationLog?: IConfigurationLog[] | null;
  technology: ITechnology | null;
  autoChecking?: boolean;
}

export function CheckConfigurationPanel(props: Props) {
  const { configurationProfile, configurationLog, technology, autoChecking } =
    props;

  const {
    detected,
    checked,
    check,
    requestPort,
    isChecking,
    isDetecting,
    autoCheckingEnabled,
    toggleAutoChecking,
  } = useCheckConfiguration({
    technology,
    configurationProfile,
    configurationLog,
    autoChecking,
  });

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
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
                Definição da tecnologia e perfil de configuração
              </CardTitle>
            </div>
          </div>
          <CardDescription className="ml-11">
            Escolha a tecnologia e o perfil de configuração para os equipamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="ml-11">
          <TechnologyAndConfigurationProfileSearchForm
            configurationLog={configurationLog}
            configurationProfile={configurationProfile}
            technology={technology}
          />
          <div className="mt-6 flex items-center gap-2">
            <Switch
              checked={autoCheckingEnabled}
              onCheckedChange={(checked) => toggleAutoChecking(checked)}
            />
            <Label>Ativar checagem automática</Label>
          </div>
        </CardContent>
      </Card>

      {/* Etapa 2: Portas */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Badge
              variant="default"
              className="w-8 h-8 rounded-full flex items-center justify-center p-0"
            >
              2
            </Badge>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl">Gerenciamento de Portas</CardTitle>
            </div>
          </div>
          <CardDescription className="ml-11">
            Visualize e check os equipamentos conectados às portas seriais
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
                  onClick={() =>
                    detected.length > 0 &&
                    check(detected, configurationProfile, configurationLog)
                  }
                  disabled={
                    detected.length === 0 ||
                    isDetecting ||
                    isChecking ||
                    autoCheckingEnabled
                  }
                  className="min-w-[140px] flex items-center justify-center"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Detectando
                    </>
                  ) : isChecking ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Checando
                    </>
                  ) : (
                    <>
                      <CheckCheckIcon className="mr-2 h-4 w-4" />
                      Checar
                    </>
                  )}
                </Button>

                {!configurationProfile && (
                  <p className="text-sm text-muted-foreground self-center">
                    Selecione um perfil de configuração para continuar
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
              variant={checked.length > 0 ? "default" : "secondary"}
              className="w-8 h-8 rounded-full flex items-center justify-center p-0"
            >
              3
            </Badge>
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`h-5 w-5 ${checked.length > 0 ? "text-primary" : "text-muted-foreground"}`}
              />
              <CardTitle className="text-xl">
                Verificação e Resultados
              </CardTitle>
            </div>
          </div>
          <CardDescription className="ml-11">
            {checked.length > 0
              ? `${checked.length} equipamento(s) configurado(s) com sucesso`
              : "Aguardando configuração dos equipamentos"}
          </CardDescription>
        </CardHeader>
        {technology ? (
          <CardContent className="ml-11">
            {checked.length > 0 ? (
              <div className="rounded-lg border">
                <DevicesCheckedTable
                  data={checked}
                  model={Device.Model[technology.name.system as Device.Model]}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhum equipamento configurado
                </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Complete as etapas anteriores para visualizar os equipamentos
                  checados.
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
              detectados.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
