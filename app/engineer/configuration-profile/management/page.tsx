import ConfigurationProfileTable from "@/app/lib/@frontend/ui/table/engineer/configuration-profile/table";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component/card";
import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  findManyConfigurationProfile,
  statsConfigurationProfile,
} from "@/app/lib/@backend/action/engineer/configuration-profile.action";

export default async function ConfigurationProfilePage() {
  const [configurationProfiles, stats] = await Promise.all([
    findManyConfigurationProfile({}),
    statsConfigurationProfile(),
  ]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Perfis de Configuração
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie todos os perfis de configuração registrados na sua conta
          </p>
        </div>

        <Button asChild>
          <Link href="/engineer/configuration-profile/form/create">
            <Plus className="mr-2 h-4 w-4" />
            Novo Perfil
          </Link>
        </Button>
      </div>

      <Separator />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Perfis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">perfis registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Validados por Humano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.validate_by_human}</div>
            <p className="text-xs text-muted-foreground">validações manuais</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Validados por Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.validate_by_system}</div>
            <p className="text-xs text-muted-foreground">
              validações automáticas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.validate_pending}</div>
            <p className="text-xs text-muted-foreground">
              aguardando validação
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Perfis</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os perfis de configuração
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ConfigurationProfileTable data={configurationProfiles} />
        </CardContent>
      </Card>
    </div>
  );
}
