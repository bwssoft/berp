"use client";

import { configurationProfileConstants } from "@/app/lib/constant";
import { useConfigurationProfileCreateForm } from "./use-configuration-profile.create.form";
import { IClient, ITechnology } from "@/app/lib/@backend/domain";
import {
  Alert,
  AlertDescription,
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../component";
import { GeneralConfigurationProfileForm } from "../config/general.configuration-profile.form";
import { SpecificE3Plus4GConfigurationProfileForm } from "../config/specific.e3-plus-4g.configuration-profile.form";
import { Controller, FormProvider } from "react-hook-form";
import { SpecificE3PlusConfigurationProfileForm } from "../config/specific.e3-plus.configuration-profile.form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../component/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../component/card";
import { Separator } from "../../../../component/separator";
import { Badge } from "../../../../component/badge";
import { Switch } from "../../../../component/switch";
import {
  AlertTriangle,
  Clock,
  Cpu,
  Network,
  Server,
  Settings,
  Wifi,
} from "lucide-react";
import { SpecificNB2ConfigurationProfileForm } from "../config/specific.nb-2.configuration-profile.form";
import { SpecificLoRaConfigurationProfileForm } from "../config/specific.lora.configuration-profile.form";

interface Props {
  clients: IClient[];
  technologies: ITechnology[];
}

export function ConfigurationProfileCreateForm(props: Props) {
  const { clients, technologies } = props;
  const { form, handleChangeName, handleSubmit, technology } =
    useConfigurationProfileCreateForm(props);

  function renderSpecificForm(system: string | undefined) {
    switch (system) {
      case "DM_E3_PLUS_4G":
        return <SpecificE3Plus4GConfigurationProfileForm />;
      case "DM_E3_PLUS":
        return <SpecificE3PlusConfigurationProfileForm />;
      case "DM_BWS_NB2":
        return <SpecificNB2ConfigurationProfileForm />;
      case "DM_BWS_LORA":
        return <SpecificLoRaConfigurationProfileForm />;
      default:
        return null;
    }
  }

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Seção Identificação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Identificação do Perfil
              </CardTitle>
              <CardDescription>
                Informações básicas para identificar o perfil de configuração
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="client_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selected = clients.find((c) => c.id === value);
                          if (selected) {
                            handleChangeName({
                              document: selected.document.value,
                            });
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cliente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.company_name ?? client.trade_name} –{" "}
                              {client.document.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select
                        onValueChange={(type) => {
                          field.onChange(type);
                          handleChangeName({
                            type,
                          });
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(
                            configurationProfileConstants.type
                          ).map(([label, value]) => (
                            <SelectItem key={label} value={label}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technology_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tecnologia</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selected = technologies.find(
                            (c) => c.id === value
                          );
                          if (selected) {
                            handleChangeName({
                              technology: selected.name.brand,
                            });
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma tecnologia" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {technologies.map((tech) => (
                            <SelectItem key={tech.id} value={tech.id}>
                              {tech.name.brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                disabled={true}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Perfil</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome será gerado automaticamente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Seção Configurações Gerais */}
          {technology?.name.system !== "DM_BWS_LORA" ? (
            <GeneralConfigurationProfileForm />
          ) : (
            <></>
          )}

          {/* Configurações Específicas - Renderização Condicional */}
          {technology && renderSpecificForm(technology.name.system)}

          {/* Botões de Ação */}
          <Card>
            <CardFooter className="pt-6 flex justify-between">
              <Button variant="outline" type="button">
                Cancelar
              </Button>
              <Button type="submit">Salvar Perfil</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </FormProvider>
  );
}
