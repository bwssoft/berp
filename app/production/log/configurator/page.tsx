import {
  findManyConfigurationLog,
  statsConfigurationLog,
} from "@/backend/action/production/configuration-log.action";
import {IConfigurationLog} from "@/backend/domain/production/entity/configuration-log.definition";
import { Button } from '@/frontend/ui/component/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/lib/@frontend/ui/component/card";
import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { ConfigurationLogSearchForm } from '@/frontend/ui/form/production/configuration-log/search/search.configuration-log.form';

import { ConfigurationLogTable } from "@/app/lib/@frontend/ui/table/production/configuration-log/table";
import { Plus } from "lucide-react";
import { Filter } from "mongodb";
import Link from "next/link";

export interface ConfiguratorPageSearchParams {
  query?: string;
  from?: Date;
  to?: Date;
  user?: string;
  client?: string;
  iccid?: string;
  status?: string;
  profile?: string;
}

interface Props {
  searchParams: ConfiguratorPageSearchParams;
}

export default async function Example({ searchParams }: Props) {
  const filter = query(searchParams);
  const [configurationLog, stats] = await Promise.all([
    findManyConfigurationLog(filter),
    statsConfigurationLog(),
  ]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Logs de Configuração
          </h1>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie todos os registros de configuração de
            dispositivos
          </p>
        </div>

        <Button asChild>
          <Link href="/production/tool/configurator">
            <Plus className="mr-2 h-4 w-4" />
            Nova configuração
          </Link>
        </Button>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes de Verificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              aguardando verificação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Logs de Configuração</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os registros de configuração
          </CardDescription>

          <ConfigurationLogSearchForm
            searchParams={searchParams}
            filter={filter}
          />
        </CardHeader>
        <CardContent className="p-0">
          <ConfigurationLogTable data={configurationLog} />
        </CardContent>
      </Card>
    </div>
  );
}

function query(props: Props["searchParams"]): Filter<IConfigurationLog> {
  const conditions: Filter<IConfigurationLog>[] = [];

  // Filtro geral com o parâmetro 'query'
  if (props.query) {
    const regex = { $regex: props.query, $options: "i" };
    conditions.push({
      $or: [
        { "technology.system_name": regex },
        { "client.document": regex },
        { "client.trade_name": regex },
        { "client.company_name": regex },
        { "equipment.imei": regex },
        { "equipment.firmware": regex },
        { "equipment.iccid": regex },
        { "equipment.serial": regex },
        { "user.name": regex },
      ],
    });
  }

  if (props.iccid) {
    const eqRegex = { $regex: props.iccid, $options: "i" };
    conditions.push({ "equipment.iccid": eqRegex });
  }

  if (props.profile) {
    const eqRegex = { $regex: props.profile, $options: "i" };
    conditions.push({ "desired_profile.name": eqRegex });
  }

  if (props.user) {
    const eqRegex = { $regex: props.user, $options: "i" };
    conditions.push({ "user.name": eqRegex });
  }

  if (props.client) {
    const eqRegex = { $regex: props.client, $options: "i" };
    conditions.push({
      $or: [
        { "client.document": eqRegex },
        { "client.trade_name": eqRegex },
        { "client.company_name": eqRegex },
      ],
    });
  }

  if (props.status !== undefined) {
    const statusBooleans = props.status === "success";
    conditions.push({ status: statusBooleans });
  }

  if (props.from || props.to) {
    const dateFilter: { $gte?: Date; $lte?: Date } = {};
    if (props.from) dateFilter.$gte = new Date(props.from);
    if (props.to) dateFilter.$lte = new Date(props.to);
    conditions.push({ created_at: dateFilter });
  }

  if (conditions.length === 1) return conditions[0];
  if (conditions.length > 1) return { $and: conditions };
  return {};
}

