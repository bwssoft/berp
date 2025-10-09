import type {IIdentificationLog} from "@/app/lib/@backend/domain/production/entity/identification-log.definition";
import { cn, getStatusProps } from "@/app/lib/util";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/app/lib/@frontend/ui/component/card";
import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { Badge } from "@/app/lib/@frontend/ui/component/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/app/lib/@frontend/ui/component/table";
import { deviceConstants } from "@/app/lib/constant";

interface Props {
  data: IIdentificationLog | null;
}

export function IdentificationLogDescription({ data }: Props) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Log de identificação não encontrado</CardTitle>
          <CardDescription>
            Não foi possível localizar as informações do log.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formattedCreatedAt = new Date(data.created_at).toLocaleString();
  const { Icon, text } = getStatusProps(data.status);

  const renderLoRaKeys = (loraKeys?: {
    timestamp: string;
    device_address: string;
    device_eui: string;
    application_eui: string;
    application_key: string;
    application_session_key: string;
    network_session_key: string;
  }) => {
    if (!loraKeys) return <span className="text-gray-400">--</span>;

    return (
      <div className="space-y-1 text-xs">
        <div>
          <span className="font-medium">Timestamp:</span> {loraKeys.timestamp}
        </div>
        <div>
          <span className="font-medium">Device Address:</span>{" "}
          {loraKeys.device_address}
        </div>
        <div>
          <span className="font-medium">Device EUI:</span> {loraKeys.device_eui}
        </div>
        <div>
          <span className="font-medium">App EUI:</span>{" "}
          {loraKeys.application_eui}
        </div>
        <div>
          <span className="font-medium">App Key:</span>{" "}
          {loraKeys.application_key}
        </div>
        <div>
          <span className="font-medium">App Session Key:</span>{" "}
          {loraKeys.application_session_key}
        </div>
        <div>
          <span className="font-medium">Network Session Key:</span>{" "}
          {loraKeys.network_session_key}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log de identificação</CardTitle>
        <CardDescription>
          Detalhes do log de identificação do dispositivo via porta serial.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-3 gap-x-4 gap-y-6">
          {/* Resultado */}
          <dt className="text-sm font-medium text-gray-700">Resultado</dt>
          <dd className="col-span-2 flex items-center space-x-2">
            <Badge
              className={cn(
                "flex items-center space-x-1",
                data.status &&
                  "bg-green-500 hover:bg-green-500/90 text-primary-foreground"
              )}
              variant={data.status ? "outline" : "destructive"}
            >
              <Icon className="h-4 w-4" />
              <span>{text}</span>
            </Badge>
          </dd>

          {/* Tecnologia */}
          <dt className="text-sm font-medium text-gray-700">Modelo</dt>
          <dd className="col-span-2 text-sm text-gray-600">
            {deviceConstants.model[data.technology.system_name]}
          </dd>

          {/* Criado em */}
          <dt className="text-sm font-medium text-gray-700">Criado em</dt>
          <dd className="col-span-2 text-sm text-gray-600">
            {formattedCreatedAt}
          </dd>

          {/* Usuário */}
          <dt className="text-sm font-medium text-gray-700">Usuário</dt>
          <dd className="col-span-2 text-sm text-gray-600">{data.user.name}</dd>

          <dt className="text-sm font-medium text-gray-700">Duração</dt>
          <dd className="col-span-2 text-sm text-gray-600">
            {(data.end_time - data.init_time) / 1000} s
          </dd>
        </dl>

        <Separator className="my-6" />

        {/* Comparação Antes/Depois */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900">
            Comparação dos dados do equipamento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Antes */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-red-800">Antes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-700">Serial</dt>
                  <dd className="text-sm text-gray-900 font-mono">
                    {data.equipment_before.serial}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-700">IMEI</dt>
                  <dd className="text-sm text-gray-900 font-mono">
                    {data.equipment_before.imei || "--"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-700">
                    LoRa Keys
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {renderLoRaKeys(data.equipment_before.lora_keys)}
                  </dd>
                </div>
              </CardContent>
            </Card>

            {/* Depois */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-green-800">
                  Depois
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-700">Serial</dt>
                  <dd className="text-sm text-gray-900 font-mono">
                    {data.equipment_after.serial}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-700">IMEI</dt>
                  <dd className="text-sm text-gray-900 font-mono">
                    {data.equipment_after.imei || "--"}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-700">
                    LoRa Keys
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {renderLoRaKeys(data.equipment_after.lora_keys)}
                  </dd>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Mensagens enviadas
          </h3>
          {data.messages.length > 0 ? (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Campo</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Resposta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.messages.map(({ key, request, response }) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {request}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {response ?? <span className="text-gray-400">--</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-600 mt-4">
              Nenhuma mensagem foi enviada.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
