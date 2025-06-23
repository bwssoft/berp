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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/lib/@frontend/ui/component/tabs";
import { Cpu, Settings, Activity, Wifi, Cable, Power, Zap } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ConfigurationProfileSchema } from "../create/use-configuration-profile.create.form";
import { Switch } from "../../../../component/switch";

export function SpecificLoRaConfigurationProfileForm() {
  const { control, watch } = useFormContext<ConfigurationProfileSchema>();
  const heading = watch("config.specific.heading");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Configurações Específicas - LoRa
        </CardTitle>
        <CardDescription>
          Configure parâmetros específicos do equipamento LoRa
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="config.general.data_transmission_on"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervalo de envio de mensagem</FormLabel>
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
                      <Input placeholder="180" {...field} />
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
                name="config.specific.activation_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Ativação</FormLabel>
                    <FormControl>
                      <Input placeholder="ABP ou OTAA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Configurações LoRaWAN e P2P */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <h4 className="font-medium">Configurações LoRaWAN e P2P</h4>
            <Badge variant="outline" className="text-xs">
              Comunicação
            </Badge>
          </div>

          <Tabs defaultValue="lorawan" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lorawan">LoRaWAN</TabsTrigger>
              <TabsTrigger value="p2p">P2P</TabsTrigger>
            </TabsList>

            <TabsContent value="lorawan" className="mt-6 space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <h5 className="text-sm font-medium mb-4">
                  Configurações LoRaWAN
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="config.specific.lorawan_mode_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tempo de permanência no Modo LoRaWAN
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="3600" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="config.specific.lorawan_data_transmission_event"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Intervalo de envio LoRaWAN em modo evento
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="60" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="p2p" className="mt-6 space-y-4">
              <div className="rounded-lg border bg-card p-4">
                <h5 className="text-sm font-medium mb-4">Configurações P2P</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="config.specific.p2p_mode_duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tempo de permanência no Modo P2P</FormLabel>
                        <FormControl>
                          <Input placeholder="1800" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="config.specific.p2p_data_transmission_event"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Intervalo de envio P2P em modo evento
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        {/* Configurações de Tensão */}
        <div className="space-y-6">
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
        </div>
        <Separator />

        {/* Configurações de Movimento e Sensores */}
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
              <div className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name="config.specific.heading"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch
                          id={field.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="!mt-0 !ml-0"
                        />
                      </FormControl>
                      <FormLabel htmlFor={field.name} className="!mt-0">
                        Habilitar detecção de curva
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {heading ? (
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
                ) : (
                  <></>
                )}
              </div>

              <FormField
                control={control}
                name="config.specific.heading_event_mode"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Switch
                        id={field.name}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="!mt-0 !ml-0"
                      />
                    </FormControl>
                    <FormLabel htmlFor={field.name} className="!mt-0">
                      Habilitar detecção de curva em modo evento
                    </FormLabel>
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

          <div className="rounded-lg border bg-card p-4">
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
                      <Input placeholder="2.0" {...field} />
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
                      <Input placeholder="1.0" {...field} />
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
                      <Input placeholder="0.5" {...field} />
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
                      <Input placeholder="3.0" {...field} />
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
                      <Input placeholder="3.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* <Separator /> */}
        {/* Configurações de Hardware */}
        {/* <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Cable className="h-4 w-4" />
            <h4 className="font-medium">Configurações de Hardware</h4>
            <Badge variant="outline" className="text-xs">
              I/O
            </Badge>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 rounded-lg border bg-card p-4">
              <h5 className="text-sm font-medium mb-4">LED</h5>
              <FormField
                control={control}
                name="config.specific.led_configuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuração LED</FormLabel>
                    <FormControl>
                      <Input placeholder="enabled" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex-1 rounded-lg border bg-card p-4">
              <h5 className="text-sm font-medium mb-4">FIFO</h5>
              <FormField
                control={control}
                name="config.specific.fifo_send_and_hold_times"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempos de Envio e Retenção FIFO</FormLabel>
                    <FormControl>
                      <Input placeholder="300" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">Entradas Digitais</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((inputNumber) => (
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

          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">
              Configurações Adicionais
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="config.specific.output_table"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tabela de Saídas</FormLabel>
                    <FormControl>
                      <Input placeholder="output_config" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.mcu_configuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuração MCU</FormLabel>
                    <FormControl>
                      <Input placeholder="mcu_config" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
