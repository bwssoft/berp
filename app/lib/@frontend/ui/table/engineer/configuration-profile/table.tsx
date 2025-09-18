"use client";

import { IConfigurationProfile } from "@/app/lib/@backend/domain";
import { Badge } from "@/app/lib/@frontend/ui/component/badge";
import { Button } from "@/app/lib/@frontend/ui/component/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/lib/@frontend/ui/component/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/lib/@frontend/ui/component/table";
import {
  Archive,
  Edit,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import Link from "next/link";

interface ConfigurationProfilesTableProps {
  data: (IConfigurationProfile & {
    technology: { id: string; name: { brand: string } };
    client: {
      id: string;
      document: { value: string };
      company_name: string;
      trade_name: string;
    };
  })[];
}

const getValidationStatus = (validation: {
  by_human: boolean;
  by_system: boolean;
}) => {
  if (validation.by_human && validation.by_system) {
    return {
      label: "Totalmente Validado",
      variant: "default" as const,
      icon: ShieldCheck,
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    };
  } else if (validation.by_human) {
    return {
      label: "Validado por Humano",
      variant: "secondary" as const,
      icon: Shield,
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    };
  } else if (validation.by_system) {
    return {
      label: "Validado por Sistema",
      variant: "outline" as const,
      icon: Shield,
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    };
  } else {
    return {
      label: "Pendente",
      variant: "destructive" as const,
      icon: ShieldX,
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    };
  }
};

export default function ConfigurationProfilesTable({
  data,
}: ConfigurationProfilesTableProps) {
  const handleArchive = (id: string) => {
    // Implementar lógica de arquivamento
    console.log("Arquivar perfil:", id);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px]">Nome</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tecnologia</TableHead>
            <TableHead>Validação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Shield className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Nenhum perfil de configuração encontrado
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((profile) => {
              const validationStatus = getValidationStatus(profile.validation);
              const IconComponent = validationStatus.icon;

              return (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="font-semibold">{profile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Criado em{" "}
                        {new Date(profile.created_at).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {profile.client
                        ? (profile.client?.trade_name ??
                          profile.client?.company_name)
                        : (profile.manual_client ?? "--")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">
                      {profile.technology.name.brand}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={validationStatus.variant}
                      className={validationStatus.className}
                    >
                      <IconComponent className="mr-1 h-3 w-3" />
                      {validationStatus.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/engineer/configuration-profile/form/update?id=${profile.id}`}
                            className="flex items-center"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleArchive(profile.id)}
                          className="flex items-center text-destructive focus:text-destructive"
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Arquivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
