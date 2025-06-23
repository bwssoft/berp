"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/lib/@frontend/ui/component/form";
import { Input } from "@/app/lib/@frontend/ui/component/input";
import { Badge } from "@/app/lib/@frontend/ui/component/badge";
import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { Cpu, Settings, Zap, Navigation, Activity, Cable } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ConfigurationProfileSchema } from "../create/use-configuration-profile.create.form";

export function SpecificNB2ConfigurationProfileForm() {
  const { control } = useFormContext<ConfigurationProfileSchema>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Configurações Específicas - NB-2
        </CardTitle>
        <CardDescription>
          Configure parâmetros específicos do equipamento NB-2
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Configurações Básicas */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h4 className="font-medium">Configurações Básicas</h4>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">Parâmetros Gerais</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="config.specific.odometer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hodômetro</FormLabel>
                    <FormControl>
                      <Input placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.data_transmission_event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmissão em Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.sleep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep</FormLabel>
                    <FormControl>
                      <Input placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações de Tensão */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <h4 className="font-medium">Configurações de Tensão</h4>
            <Badge variant="outline" className="text-xs">
              Monitoramento
            </Badge>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">Parâmetros de Tensão</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="config.specific.first_voltage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primeira Tensão</FormLabel>
                    <FormControl>
                      <Input placeholder="12.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.second_voltage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segunda Tensão</FormLabel>
                    <FormControl>
                      <Input placeholder="24.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações de Movimento */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            <h4 className="font-medium">Configurações de Movimento</h4>
            <Badge variant="outline" className="text-xs">
              Navegação
            </Badge>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">
              Parâmetros de Navegação
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="config.specific.angle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ângulo</FormLabel>
                    <FormControl>
                      <Input placeholder="45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Velocidade</FormLabel>
                    <FormControl>
                      <Input placeholder="120" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações de Hardware */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Cable className="h-4 w-4" />
            <h4 className="font-medium">Configurações de Hardware</h4>
            <Badge variant="outline" className="text-xs">
              I/O
            </Badge>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">Entradas Digitais</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4].map((inputNumber) => (
                <FormField
                  key={inputNumber}
                  control={control}
                  name={`config.specific.input_${inputNumber}` as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entrada {inputNumber}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Entrada ${inputNumber}`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações do Acelerômetro */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <h4 className="font-medium">Configurações do Acelerômetro</h4>
            <Badge variant="outline" className="text-xs">
              Sensores
            </Badge>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">
              Sensibilidade do Acelerômetro
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="config.specific.accelerometer_sensitivity_on"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sensibilidade Ligado</FormLabel>
                    <FormControl>
                      <Input placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.accelerometer_sensitivity_off"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sensibilidade Desligado</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.accelerometer_sensitivity_violated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sensibilidade Violada</FormLabel>
                    <FormControl>
                      <Input placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">Limites de Aceleração</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="config.specific.maximum_acceleration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aceleração Máxima</FormLabel>
                    <FormControl>
                      <Input placeholder="2.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.maximum_deceleration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desaceleração Máxima</FormLabel>
                    <FormControl>
                      <Input placeholder="3.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
