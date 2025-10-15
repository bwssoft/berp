"use client";

import { configurationProfileConstants } from "@/app/lib/constant";
import {
  Props,
  useConfigurationProfileUpsertForm,
} from "./use-configuration-profile.upsert.form";
import { Button } from '@/frontend/ui/component/button';
import { Input } from '@/frontend/ui/component/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/frontend/ui/component/select';

import { GeneralConfigurationProfileForm } from "../config/general.configuration-profile.form";
import { SpecificE3Plus4GConfigurationProfileForm } from "../config/specific.e3-plus-4g.configuration-profile.form";
import { FormProvider } from "react-hook-form";
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
import { Settings } from "lucide-react";
import { SpecificNB2ConfigurationProfileForm } from "../config/specific.nb-2.configuration-profile.form";
import { SpecificLoRaConfigurationProfileForm } from "../config/specific.lora.configuration-profile.form";

export function ConfigurationProfileUpsertForm(props: Props) {
  const { clients, technologies, defaultValues } = props;
  const {
    form,
    handleChangeName,
    handleSubmit,
    handleChangeTechnology,
    technology,
    handleChangeClient,
  } = useConfigurationProfileUpsertForm(props);

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
                  name="technology_id"
                  defaultValue={defaultValues?.technology.id}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tecnologia</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleChangeTechnology(value);
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

                <FormField
                  control={form.control}
                  name="type"
                  defaultValue={defaultValues?.configurationProfile.type}
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
                  name="manual_client"
                  render={({ field }) => (
                    <Input
                      value={field.value}
                      onChange={(event) => {
                        field.onChange(event.target.value);
                        handleChangeClient(event.target.value);
                      }}
                      label="Cliente"
                      placeholder="Nome - CNPJ"
                    />
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
            <GeneralConfigurationProfileForm technology={technology} />
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
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Salvar Perfil
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </FormProvider>
  );
}
