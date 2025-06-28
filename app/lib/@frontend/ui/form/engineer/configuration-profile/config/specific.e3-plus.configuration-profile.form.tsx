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
import { Cpu, Lock, Settings, Zap, AlertTriangle } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { configurationProfileConstants } from "@/app/lib/constant";
import { ConfigurationProfileSchema } from "../upsert/use-configuration-profile.upsert.form";

export function SpecificE3PlusConfigurationProfileForm() {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="h-5 w-5" />
          Configurações Específicas - E3+
        </CardTitle>
        <CardDescription>
          Configure parâmetros específicos do equipamento E3+
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
                      {configurationProfileConstants.config.DM_E3_PLUS.lockType.map(
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
                name="config.specific.work_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modo de Trabalho</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o modo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {configurationProfileConstants.config.DM_E3_PLUS.workMode.map(
                          (mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
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
                name="config.specific.accelerometer_sensitivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sensibilidade do Acelerômetro</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a sensibilidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {configurationProfileConstants.config.DM_E3_PLUS.accelerometerSensitivity.map(
                          (sens) => (
                            <SelectItem
                              key={sens.value}
                              value={sens.value.toString()}
                            >
                              {sens.label}
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
                name="config.specific.economy_mode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modo de Economia</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o modo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {configurationProfileConstants.config.DM_E3_PLUS.economyMode.map(
                          (mode) => (
                            <SelectItem
                              key={mode.value}
                              value={mode.value.toString()}
                            >
                              {mode.label}
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
                name="config.specific.odometer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hodômetro</FormLabel>
                    <FormControl>
                      <Input placeholder="5000" type="number" {...field} />
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
                      <Input placeholder="150" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="config.specific.sensitivity_adjustment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ajuste de Sensibilidade</FormLabel>
                    <FormControl>
                      <Input placeholder="500" type="number" {...field} />
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
                      <Input placeholder="2" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            {configurationProfileConstants.config.DM_E3_PLUS.functions.map(
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
            {configurationProfileConstants.config.DM_E3_PLUS.optionalFunctions.map(
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
