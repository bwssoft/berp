import { useFormContext } from "react-hook-form";
import { ConfigurationProfileSchema } from "../upsert/use-configuration-profile.upsert.form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../component/card";
import { Clock, Network, Server, Wifi } from "lucide-react";
import { Badge } from "../../../../component/badge";
import {
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../component";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../../component/form";
import { useGeneralConfigurationProfileForm } from "./use-general.configuration-profile.form";
import { ITechnology } from "@/app/lib/@backend/domain";

interface Props {
  technology: ITechnology | undefined;
}
export function GeneralConfigurationProfileForm(props: Props) {
  const { technology } = props;
  const { form, handleChangeServerOption } =
    useGeneralConfigurationProfileForm();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Configurações Gerais
        </CardTitle>
        <CardDescription>
          Configure como o equipamento irá se comunicar com a rede
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* APN Configuration */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="h-4 w-4" />
            <h4 className="font-medium">Configuração APN</h4>
            <Badge variant="outline" className="text-xs">
              Rede
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="config.general.apn.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>APN</FormLabel>
                  <FormControl>
                    <Input placeholder="bws.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="config.general.apn.user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuário</FormLabel>
                  <FormControl>
                    <Input placeholder="bws" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="config.general.apn.password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input placeholder="bws" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Tabs para IP e DNS */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Server className="h-4 w-4" />
            <h4 className="font-medium">Configuração de Servidores</h4>
          </div>

          <Tabs defaultValue="ip" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="ip"
                className="flex items-center gap-2"
                onClick={() =>
                  technology && handleChangeServerOption("ip", technology)
                }
              >
                <Server className="h-4 w-4" />
                Servidores IP
              </TabsTrigger>
              <TabsTrigger
                value="dns"
                className="flex items-center gap-2"
                onClick={() =>
                  technology && handleChangeServerOption("dns", technology)
                }
              >
                <Network className="h-4 w-4" />
                Servidores DNS
              </TabsTrigger>
            </TabsList>

            {/* Tab Content para IP */}
            <TabsContent value="ip" className="mt-6 space-y-6">
              {/* IP Primário */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Primário
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">
                    Servidor principal de comunicação
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="config.general.ip_primary.ip"
                    defaultValue={undefined}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço IP</FormLabel>
                        <FormControl>
                          <Input placeholder="127.0.0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="config.general.ip_primary.port"
                    defaultValue={undefined}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Porta</FormLabel>
                        <FormControl>
                          <Input placeholder="3000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* IP Secundário */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Secundário
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">
                    Servidor de backup
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="config.general.ip_secondary.ip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Endereço IP</FormLabel>
                        <FormControl>
                          <Input placeholder="127.0.0.2" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="config.general.ip_secondary.port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Porta</FormLabel>
                        <FormControl>
                          <Input placeholder="3001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab Content para DNS */}
            <TabsContent value="dns" className="mt-6 space-y-6">
              {/* DNS Primário */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Primário
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">
                    Servidor DNS principal
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="config.general.dns_primary.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host DNS</FormLabel>
                        <FormControl>
                          <Input placeholder="gw.bws-infra.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="config.general.dns_primary.port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Porta</FormLabel>
                        <FormControl>
                          <Input placeholder="3000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* DNS Secundário */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Secundário
                  </Badge>
                  <span className="text-sm font-medium text-muted-foreground">
                    Servidor DNS de backup
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="config.general.dns_secondary.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Host DNS</FormLabel>
                        <FormControl>
                          <Input placeholder="gw2.bws-infra.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="config.general.dns_secondary.port"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Porta</FormLabel>
                        <FormControl>
                          <Input placeholder="3001" {...field} />
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

        {/* Transmission Configuration */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4" />
            <h4 className="font-medium">Configurações de Transmissão</h4>
            <Badge variant="outline" className="text-xs">
              Intervalos
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="config.general.data_transmission_on"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalo Ligado (s)</FormLabel>
                  <FormControl>
                    <Input placeholder="60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="config.general.data_transmission_off"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalo Desligado (s)</FormLabel>
                  <FormControl>
                    <Input placeholder="7200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="config.general.keep_alive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keep Alive (min)</FormLabel>
                  <FormControl>
                    <Input placeholder="60" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
