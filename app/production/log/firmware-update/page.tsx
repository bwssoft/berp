import {
  findManyFirmwareUpdateLog,
  statsFirmwareUpdateLog,
} from "@/app/lib/@backend/action/production/firmware-update-log.action";
import { IFirmwareUpdateLog } from "@/app/lib/@backend/domain";
import { Button } from '@/frontend/ui/component/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/lib/@frontend/ui/component/card";
import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { FirmwareUpdateLogTable } from "@/app/lib/@frontend/ui/table/production/firmware-update-log/table";
import { Plus } from "lucide-react";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
  searchParams: {
    query?: string;
    equipment?: string;
    technology?: string;
    status?: string[];
    user?: string;
    start_date?: Date;
    end_date?: Date;
  };
}

export default async function Example({ searchParams }: Props) {
  const filter = query(searchParams);
  const [firmwareUpdateLog, stats] = await Promise.all([
    findManyFirmwareUpdateLog(filter),
    statsFirmwareUpdateLog(),
  ]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Logs de Gravação de Firmware
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie todos os registros de gravação de firmware
          </p>
        </div>

        <Button asChild>
          <Link href="/production/tool/configurator">
            <Plus className="mr-2 h-4 w-4" />
            Nova Gravação
          </Link>
        </Button>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">logs registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bem-sucedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.success}</div>
            <p className="text-xs text-muted-foreground">
              configurações com sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falhos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">
              configurações falhas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Logs de Gravação de Firmware</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os registros de gravação de firmware
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <FirmwareUpdateLogTable data={firmwareUpdateLog} />
        </CardContent>
      </Card>
    </div>
  );
}

function query(props: Props["searchParams"]): Filter<IFirmwareUpdateLog> {
  const conditions: Filter<IFirmwareUpdateLog>[] = [];

  // Filtro geral com o parâmetro 'query'
  if (props.query) {
    const regex = { $regex: props.query, $options: "i" };
    conditions.push({
      $or: [
        { "technology.system_name": regex },
        { "equipment.imei": regex },
        { "equipment.firmware": regex },
        { "equipment.iccid": regex },
        { "equipment.serial": regex },
        { "user.name": regex },
      ],
    });
  }

  // Filtros específicos...
  if (props.equipment) {
    const eqRegex = { $regex: props.equipment, $options: "i" };
    conditions.push({
      $or: [
        { "equipment.imei": eqRegex },
        { "equipment.serial": eqRegex },
        { "equipment.iccid": eqRegex },
        { "equipment.firmware": eqRegex },
      ],
    });
  }

  if (props.user) {
    const eqRegex = { $regex: props.user, $options: "i" };
    conditions.push({ "user.name": eqRegex });
  }

  if (props.technology) {
    const eqRegex = { $regex: props.technology, $options: "i" };
    conditions.push({ "technology.system_name": eqRegex });
  }

  if (props.status) {
    const statusBooleans = props.status.map((s) => s === "true");
    conditions.push({ status: { $in: statusBooleans } });
  }

  if (props.start_date || props.end_date) {
    const dateFilter: { $gte?: Date; $lte?: Date } = {};
    if (props.start_date) dateFilter.$gte = props.start_date;
    if (props.end_date) dateFilter.$lte = props.end_date;
    conditions.push({ created_at: dateFilter });
  }

  if (conditions.length === 1) return conditions[0];
  if (conditions.length > 1) return { $and: conditions };
  return {};
}
