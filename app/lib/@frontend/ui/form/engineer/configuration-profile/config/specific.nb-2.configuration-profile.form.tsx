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
import { ConfigurationProfileSchema } from "../upsert/use-configuration-profile.upsert.form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/ui/component/select';


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
                name="config.specific.data_transmission_event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Envio de mensagens em modo evento</FormLabel>
                    <FormControl>
                      <Input placeholder="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.time_to_sleep"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Definir tempo para iniciar modo sleep</FormLabel>
                    <FormControl>
                      <Input placeholder="7200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.odometer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Definir Hodômetro</FormLabel>
                    <FormControl>
                      <Input placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.economy_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modo de economia</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um modo de economia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">
                          Modo 1 (GPS OFF e Rede ON em sleep)
                        </SelectItem>
                        <SelectItem value="2">
                          Modo 2 (GPS OFF e Rede OFF em sleep)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.lock_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de bloqueio</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo de bloqueio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Bloqueio Padrão</SelectItem>
                        <SelectItem value="2">Bloqueio invertido</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações de Tensão */}
        {/* <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <h4 className="font-medium">Configurações de Tensão</h4>
            <Badge variant="outline" className="text-xs">
              Ignição Virtual
            </Badge>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">Tensão 12V</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="config.specific.virtual_ignition_12v.initial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Inicial</FormLabel>
                    <FormControl>
                      <Input placeholder="12.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.virtual_ignition_12v.final"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Final</FormLabel>
                    <FormControl>
                      <Input placeholder="24.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">Tensão 24V</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="config.specific.virtual_ignition_24v.initial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Inicial</FormLabel>
                    <FormControl>
                      <Input placeholder="12.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.virtual_ignition_24v.final"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Final</FormLabel>
                    <FormControl>
                      <Input placeholder="24.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div> */}

        <Separator />

        {/* Configurações de Movimento */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <h4 className="font-medium">
              Configurações de Movimento e Sensores
            </h4>
            <Badge variant="outline" className="text-xs">
              Acelerômetro
            </Badge>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">
              Detecção de Curva e Velocidade
            </h5>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
                <FormField
                  control={control}
                  name="config.specific.heading_detection_angle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ângulo para Detecção de Curva</FormLabel>
                      <FormControl>
                        <Input placeholder="45" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="config.specific.speed_alert_threshold"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limite de Alerta de Velocidade</FormLabel>
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

          {/* <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">
              Configurações do Acelerômetro
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="config.specific.accel_threshold_for_ignition_on"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite para detectar ignição ligada</FormLabel>
                    <FormControl>
                      <Input placeholder="235" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.accel_threshold_for_ignition_off"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Limite para detectar ignição desligada
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="241" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.accel_threshold_for_movement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite para detectar movimentação</FormLabel>
                    <FormControl>
                      <Input placeholder="65535" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.harsh_acceleration_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Limite para detectar Aceleração Brusca
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="65534" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.harsh_braking_threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite para detectar Frenagem Brusca</FormLabel>
                    <FormControl>
                      <Input placeholder="65533" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div> */}
        </div>

        {/* Configurações de Hardware */}
        {/* <Separator />
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
        </div> */}
      </CardContent>
    </Card>
  );
}
