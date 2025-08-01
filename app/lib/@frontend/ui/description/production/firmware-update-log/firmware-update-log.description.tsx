import React from "react";
import { IFirmwareUpdateLog } from "@/app/lib/@backend/domain";
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
  data: IFirmwareUpdateLog | null;
}

export function FirmwareUpdateLogDescription({ data }: Props) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Log de configuração não encontrado</CardTitle>
          <CardDescription>
            Não foi possível localizar as informações do log.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formattedCreatedAt = new Date(data.created_at).toLocaleString();
  const { Icon, text, statusClass } = getStatusProps(data.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log de gravação de firmware</CardTitle>
        <CardDescription>
          Detalhes do log de gravação de firmware via porta serial.
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

          {/* Equipamento */}
          <dt className="text-sm font-medium text-gray-700">Serial</dt>
          <dd className="col-span-2 text-sm text-gray-600">
            {data.equipment.serial}
          </dd>

          <dt className="text-sm font-medium text-gray-700">Firmware</dt>
          <dd className="col-span-2 text-sm text-gray-600">
            {data.equipment.firmware}
          </dd>

          {data.equipment.imei && (
            <>
              <dt className="text-sm font-medium text-gray-700">IMEI</dt>
              <dd className="col-span-2 text-sm text-gray-600">
                {data.equipment.imei}
              </dd>
            </>
          )}

          {data.equipment.lora_keys && (
            <>
              <dt className="text-sm font-medium text-gray-700">LoRa Keys</dt>
              <dd className="col-span-2 text-sm text-gray-600">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(data.equipment.lora_keys).map(
                    ([key, val]) => (
                      <React.Fragment key={key}>
                        <dt className="text-sm font-medium text-gray-700">
                          {key}
                        </dt>
                        <dd className="text-sm text-gray-600">{val}</dd>
                      </React.Fragment>
                    )
                  )}
                </dl>
              </dd>
            </>
          )}

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

        <Separator className="col-span-3 my-4" />

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">
            Mensagens enviadas
          </h3>
          {data.messages.length > 0 ? (
            <Table className="mt-2">
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
                    <TableCell>{key}</TableCell>
                    <TableCell>{request}</TableCell>
                    <TableCell>{response ?? "--"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-gray-600 mt-2">
              Nenhum mensagem foi enviada.
            </p>
          )}
        </div>
        <Separator className="col-span-3 my-4" />
      </CardContent>
    </Card>
  );
}
