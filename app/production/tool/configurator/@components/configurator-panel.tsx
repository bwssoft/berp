"use client";

import {
  Device,
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

import { useConfiguration } from "@/app/lib/@frontend/hook";
import {
  Settings,
  Zap,
  CheckCircle,
  Plus,
  Loader2,
  SquareArrowDownRight,
  SquareArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { Switch } from "@/app/lib/@frontend/ui/component/switch";
import { Label } from "@/app/lib/@frontend/ui/component/label";
import Link from "next/link";
import { DevicesDetectedTable } from "@/app/lib/@frontend/ui/table/production/devices-detected/table";
import { DevicesConfiguredTable } from "@/app/lib/@frontend/ui/table/production/devices-configured/table";

interface Props {
  configurationProfile: IConfigurationProfile | null;
  technology: ITechnology | null;
}

export function ConfiguratorPanel(props: Props) {
  const { configurationProfile, technology } = props;

  const {
    detected,
    configured,
    configure,
    requestPort,
    isConfiguring,
    isDetecting,
    autoConfigurationEnabled,
    toggleAutoConfiguration,
    redirectToCheckEnabled,
    toggleRedirectToCheck,
    redirectToCheck,
  } = useConfiguration({
    technology,
    configurationProfile,
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
            configurationProfile={configurationProfile}
            technology={technology}
          />
          <div className="mt-6 flex items-center gap-2">
            <Switch
              checked={autoConfigurationEnabled}
              onCheckedChange={(checked) => toggleAutoConfiguration(checked)}
            />
            <Label>Ativar configuração automática</Label>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <Switch
              checked={redirectToCheckEnabled}
              onCheckedChange={(checked) => toggleRedirectToCheck(checked)}
            />
            <Label>Ativar redirecionamento para checagem</Label>
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
            Visualize e configure os equipamentos conectados às portas seriais
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
                    configurationProfile &&
                    configure(detected, configurationProfile)
                  }
                  disabled={
                    !configurationProfile ||
                    detected.length === 0 ||
                    isDetecting ||
                    isConfiguring
                  }
                  className="min-w-[140px] flex items-center justify-center"
                >
                  {isDetecting ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Detectando
                    </>
                  ) : isConfiguring ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Configurando
                    </>
                  ) : (
                    <>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurar
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
              variant={configured.length > 0 ? "default" : "secondary"}
              className="w-8 h-8 rounded-full flex items-center justify-center p-0"
            >
              3
            </Badge>
            <div className="flex items-center gap-2">
              <CheckCircle
                className={`h-5 w-5 ${configured.length > 0 ? "text-primary" : "text-muted-foreground"}`}
              />
              <CardTitle className="text-xl">
                Verificação e Resultados
              </CardTitle>
            </div>
            <Button
              variant="link"
              disabled={!configured.length}
              onClick={() => redirectToCheck(configured)}
              className="ml-auto"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Checar configurações
            </Button>
          </div>
          <CardDescription className="ml-11">
            {configured.length > 0
              ? `${configured.length} equipamento(s) configurado(s) com sucesso`
              : "Aguardando configuração dos equipamentos"}
          </CardDescription>
        </CardHeader>
        {technology ? (
          <CardContent className="ml-11">
            {configured.length > 0 ? (
              <div className="rounded-lg border">
                <DevicesConfiguredTable
                  data={configured}
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
                  configurados.
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
