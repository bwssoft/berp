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
import {
  DevicesConfiguredTable,
  DevicesDetectedTable,
} from "@/app/lib/@frontend/ui/table";
import { useConfiguration } from "@/app/lib/@frontend/hook";
import { Settings, Zap, CheckCircle, Plus } from "lucide-react";

interface Props {
  configurationProfile: IConfigurationProfile | null;
  technology: ITechnology | null;
}

export function ConfiguratorPanel(props: Props) {
  const { configurationProfile, technology } = props;

  const { identified, configured, configure, requestPort, isProcessing } =
    useConfiguration({
      technology,
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
        <CardContent className="ml-11 space-y-6">
          {technology && (
            <div className="rounded-lg border">
              <DevicesDetectedTable
                data={identified}
                model={Device.Model[technology.name.system as Device.Model]}
              />
            </div>
          )}

          <Separator />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => configure(configurationProfile)}
                disabled={isProcessing || !configurationProfile}
                className="min-w-[140px]"
              >
                {isProcessing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Configurando...
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
              size="lg"
              onClick={requestPort}
              className="min-w-[140px]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Porta
            </Button>
          </div>
        </CardContent>
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
          </div>
          <CardDescription className="ml-11">
            {configured.length > 0
              ? `${configured.length} equipamento(s) configurado(s) com sucesso`
              : "Aguardando configuração dos equipamentos"}
          </CardDescription>
        </CardHeader>
        <CardContent className="ml-11">
          {configured.length > 0 ? (
            <div className="rounded-lg border">
              <DevicesConfiguredTable data={configured} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Nenhum equipamento configurado
              </h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Complete as etapas anteriores para visualizar os equipamentos
                configurados e os comandos enviados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
