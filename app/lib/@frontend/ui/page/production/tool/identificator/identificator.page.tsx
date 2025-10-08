"use client";

import { Device, ITechnology } from "@/app/lib/@backend/domain";
import { Badge } from '@/frontend/ui/component/badge';
import { Button } from '@/frontend/ui/component/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/ui/component/card';

import { IdentificationForm } from '@/frontend/ui/form/production/identification/identification.form';
import { TechnologySearchForm } from '@/frontend/ui/form/production/technology-search/technology-search-form';

import { DevicesDetectedTable } from "@/app/lib/@frontend/ui/table/production/devices-detected/table";
import { DevicesIdentifiedTable } from "@/app/lib/@frontend/ui/table/production/devices-identified/table";
import { CheckCircle, Plus, Settings, Zap } from "lucide-react";
import { Separator } from "../../../../component/separator";
import { useIdentification } from "./use-identificator";

interface Props {
  technology: ITechnology | null;
}
export function IdentificatorPage(props: Props) {
  const { technology } = props;

  const {
    identified,
    detected,
    identify,
    requestPort,
    isDetecting,
    isIdentifying,
  } = useIdentification({
    technology,
  });

  const hasIdentified = identified.length > 0;
  const date = new Date();
  return (
    <>
      <div className="container mx-auto pb-8 px-4 space-y-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Gravador de serial
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Ferramenta para identificar{" "}
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
            <CardDescription className="ml-11">
              Visualize e identifique os equipamentos conectados às portas
              seriais
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
                <IdentificationForm
                  isDetecting={isDetecting}
                  isIdentifying={isIdentifying}
                  onSubmit={identify}
                  technology={technology}
                  detected={detected}
                />

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
                variant={hasIdentified ? "default" : "secondary"}
                className="w-8 h-8 rounded-full flex items-center justify-center p-0"
              >
                3
              </Badge>
              <div className="flex items-center gap-2">
                <CheckCircle
                  className={`h-5 w-5 ${hasIdentified ? "text-primary" : "text-muted-foreground"}`}
                />
                <CardTitle className="text-xl">
                  Verificação e Resultados
                </CardTitle>
              </div>
            </div>
            <CardDescription className="ml-11">
              {hasIdentified
                ? `${identified.length} equipamento(s) identificado(s) com sucesso`
                : "Aguardando identificação dos equipamentos"}
            </CardDescription>
          </CardHeader>
          {technology ? (
            <CardContent className="ml-11">
              {hasIdentified ? (
                <div className="rounded-lg border">
                  <DevicesIdentifiedTable
                    data={identified}
                    model={Device.Model[technology.name.system as Device.Model]}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Nenhum equipamento identificado
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Complete as etapas anteriores para visualizar os
                    equipamentos identificados.
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
    </>
  );
}
