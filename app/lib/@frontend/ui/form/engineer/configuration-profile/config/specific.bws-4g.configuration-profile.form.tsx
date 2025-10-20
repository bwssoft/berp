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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/@frontend/ui/component/select";
import { Switch } from "@/app/lib/@frontend/ui/component/switch";
import { Badge } from "@/app/lib/@frontend/ui/component/badge";
import {
  Alert,
  AlertDescription,
} from "@/app/lib/@frontend/ui/component/alert";
import { Checkbox } from "@/app/lib/@frontend/ui/component/checkbox";
import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { Cpu, Lock, Settings, Zap, AlertTriangle, Cable } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { ConfigurationProfileSchema } from "../upsert/use-configuration-profile.upsert.form";
import { configurationProfileConstants } from "@/app/lib/constant";

export function SpecificBws4GConfigurationProfileForm() {
  const { control, watch } = useFormContext<ConfigurationProfileSchema>();

  const lockType = watch("config.specific.lock_type");
  const corneringUpdate = watch("config.specific.cornering_position_update");
  const virtualIgnition = watch("config.specific.virtual_ignition");
  const ignitionByVoltage = watch(
    "config.specific.virtual_ignition_by_voltage"
  );
  const ignitionByMovement = watch(
    "config.specific.virtual_ignition_by_movement"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Configurações Específicas - BWS 4G
        </CardTitle>
        <CardDescription>
          Configure parâmetros específicos do equipamento BWS 4G
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Configurações Básicas */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h4 className="font-medium">Configurações Básicas</h4>
          </div>

          {/* Alteração de Senha */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4" />
              <h5 className="text-sm font-medium">Alteração de Senha</h5>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="config.specific.password.old"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <FormControl>
                      <Input placeholder="000000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="config.specific.password.new"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Configurações de Bloqueio */}
          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">
              Configurações de Bloqueio
            </h5>
            <div className="space-y-4">
              <FormField
                control={control}
                name="config.specific.lock_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Bloqueio</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de bloqueio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {configurationProfileConstants.config.DM_BWS_4G.lockType.map(
                          (type) => (
                            <SelectItem
                              key={type.value}
                              value={type.value.toString()}
                            >
                              {type.label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {typeof lockType === "number" && (
                <FormField
                  control={control}
                  name="config.specific.lock_type_variation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variação do bloqueio</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o a variação do bloqueio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {configurationProfileConstants.config.DM_BWS_4G.lockTypeVariation.map(
                            (type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value.toString()}
                              >
                                {type.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* Configurações Gerais */}
          <div className="rounded-lg border bg-card p-4">
            <h5 className="text-sm font-medium mb-4">Configurações Gerais</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={control}
                name="config.specific.timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuso Horário</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fuso" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {configurationProfileConstants.timezones.map((tz) => (
                          <SelectItem
                            key={tz.value}
                            value={tz.value.toString()}
                          >
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                name="config.specific.max_speed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Velocidade Máxima</FormLabel>
                    <FormControl>
                      <Input placeholder="150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.horimeter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horímetro (minutos)</FormLabel>
                    <FormControl>
                      <Input placeholder="3600" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Entradas e Comunicação */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Cable className="h-4 w-4" />
            <h4 className="font-medium">Entradas e Comunicação</h4>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h5 className="text-sm font-medium">
                  Configurações de Entrada
                </h5>
                <FormField
                  control={control}
                  name="config.specific.input_1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entrada 1</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {configurationProfileConstants.config.DM_BWS_4G.input1.map(
                            (type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value.toString()}
                              >
                                {type.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="config.specific.input_2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entrada 2</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {configurationProfileConstants.config.DM_BWS_4G.input2.map(
                            (type) => (
                              <SelectItem
                                key={type.value}
                                value={type.value.toString()}
                              >
                                {type.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h5 className="text-sm font-medium">
                  Configurações de Comunicação
                </h5>
                <FormField
                  control={control}
                  name="config.specific.communication_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Comunicação</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {configurationProfileConstants.config.DM_BWS_4G.communicationType.map(
                            (type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="config.specific.protocol_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Protocolo</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o protocolo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {configurationProfileConstants.config.DM_BWS_4G.protocolType.map(
                            (type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Funções Principais */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <h4 className="font-medium">Funções Principais</h4>
            <Badge variant="destructive" className="text-xs">
              Comandos Imediatos
            </Badge>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Estas alterações gerarão comandos imediatamente ao serem ativadas
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Funções básicas */}
            {configurationProfileConstants.config.DM_BWS_4G.functions.map(
              (func, index) => (
                <FormField
                  key={index}
                  control={control}
                  name={
                    `config.specific.${func.name}` as keyof ConfigurationProfileSchema["config"]["specific"]
                  }
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          {func.label}
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )
            )}

            {/* Atualização de posição em curva */}
            <div className="rounded-lg border p-4 space-y-4">
              <FormField
                control={control}
                name="config.specific.angle_adjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Ajuste de ângulo para detecção de curva
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="45" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Funções Opcionais */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <h4 className="font-medium">Funções Opcionais</h4>
            <Badge variant="secondary" className="text-xs">
              Ativação Manual
            </Badge>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Estas funções só gerarão comandos quando explicitamente ativadas
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {configurationProfileConstants.config.DM_BWS_4G.optionalFunctions.map(
              (func, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">{func.label}</FormLabel>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`activate-${index}`} />
                      <label
                        htmlFor={`activate-${index}`}
                        className="text-sm font-medium"
                      >
                        Ativar comando
                      </label>
                    </div>
                    <FormField
                      control={control}
                      name={
                        `config.specific.${func.name}` as keyof ConfigurationProfileSchema["config"]["specific"]
                      }
                      render={({ field }) => (
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
