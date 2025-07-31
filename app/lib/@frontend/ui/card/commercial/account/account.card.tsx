"use client";

import { Building2, DollarSign, Tag, User } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InfoField,
} from "../../../component";
import { Separator } from "../../../component/separator";
import { IAccount } from "@/app/lib/@backend/domain";
import { StatusBadge } from "../../../page/commercial/account/data/account.data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../component/tooltip";
import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/24/outline";

export function AccountCard({
  account,
  onClickButtonEdit,
  onRefresh,
}: {
  account: IAccount;
  onClickButtonEdit?: () => void;
  onRefresh?: () => void;
}) {
  const isCompany = account.document.type === "cnpj";

  return (
    <TooltipProvider>
      <Card className="flex flex-col h-full">
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="flex items-center justify-between">
            <div className="flex gap-1">
              <div className="flex items-center gap-2">
                {isCompany ? (
                  <Building2 className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
                {isCompany ? "Dados da Empresa" : "Dados Pessoais"}
              </div>
              <Badge variant="outline" className="text-xs h-fit">
                {account.document.type.toUpperCase()}
              </Badge>
            </div>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRefresh}
                    aria-label="Atualizar dados da conta"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Atualizar dados da conta</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClickButtonEdit}
                    aria-label="Editar dados da empresa"
                  >
                    <PencilSquareIcon className="w-5 h-5 cursor-pointer" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Editar dados da conta</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          {/* Grid otimizado para melhor uso do espaço */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {isCompany ? (
              <>
                <InfoField label="Razão Social" value={account.social_name} />
                <InfoField label="Nome Fantasia" value={account.fantasy_name} />
                <InfoField label="CNPJ" value={account.document.value} />
                <InfoField
                  label="Inscrição Estadual"
                  value={account.state_registration}
                />
                <InfoField
                  label="Inscrição Municipal"
                  value={account.municipal_registration}
                />
                {/* Campo adicional para preencher o grid se necessário */}
                {account.status && (
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Status Geral
                    </dt>
                    <dd className="flex items-center">
                      <StatusBadge status={account.status} type="general" />
                    </dd>
                  </div>
                )}
                <InfoField
                  label="Situação IE"
                  value={account.situationIE?.text}
                />
                <InfoField label="Tipo IE" value={account.typeIE} />
              </>
            ) : (
              <>
                <InfoField label="Nome" value={account.name} />
                <InfoField label="CPF" value={account.document.value} />
                <InfoField label="RG/CIN" value={account.rg} />
                {account.status && (
                  <div className="space-y-1">
                    <dt className="text-sm font-medium text-muted-foreground">
                      Status
                    </dt>
                    <dd className="flex items-center">
                      <StatusBadge status={account.status} type="general" />
                    </dd>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Seção de Status de Cobrança e Setores */}
          {(account.billing_status ||
            account.billing_situation ||
            (account.setor && account.setor.length > 0)) && (
            <>
              <Separator className="mb-6" />
              <div className="space-y-6 flex-1">
                {/* Status de Cobrança */}
                {(account.billing_status || account.billing_situation) && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Status de Cobrança
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {account.billing_status && (
                        <StatusBadge
                          status={account.billing_status}
                          type="billing"
                        />
                      )}
                      {account.billing_situation && (
                        <StatusBadge
                          status={account.billing_situation}
                          type="situation"
                        />
                      )}
                    </div>
                    {account.last_billing_date && (
                      <div className="text-xs text-muted-foreground">
                        Última cobrança:{" "}
                        <span className="font-mono">
                          {account.last_billing_date.toLocaleString() || "----"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Setores */}
                {account.setor && account.setor.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Setores de Atuação
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {account.setor.map((setor, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {setor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Informações do Sistema - Sempre no final */}
          <div className="mt-auto pt-6">
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">
                  Data de Criação
                </dt>
                <dd className="text-sm font-mono text-muted-foreground">
                  {account.created_at?.toLocaleString()}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-sm font-medium text-muted-foreground">
                  Última Atualização
                </dt>
                <dd className="text-sm font-mono text-muted-foreground">
                  {account.updated_at?.toLocaleString() || "----"}
                </dd>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
