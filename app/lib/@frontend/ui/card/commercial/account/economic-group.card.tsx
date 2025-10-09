import { Users } from "lucide-react";
import { Badge } from '@/frontend/ui/component/badge';
import { Button } from '@/frontend/ui/component/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/ui/component/card';

import {IAccountEconomicGroup} from "@/app/lib/@backend/domain/commercial/entity/account.economic-group.definition";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { formatLgpdCpf } from "@/app/lib/util/format-lgpd-cpf";
import { formatLgpdCnpj } from "@/app/lib/util/format-lgpd-cnpj";

interface LgpdPermissions {
  fullLgpdAccess?: boolean;
  partialLgpdAccess?: boolean;
}

interface EconomicGroupCardProps {
  accountId: string;
  economicGroup?: IAccountEconomicGroup | null;
  hasPermissionEconomicGroup: boolean;
  openModal: () => void;
  lgpdPermissions?: LgpdPermissions;
}

export function EconomicGroupCard({
  accountId,
  economicGroup,
  hasPermissionEconomicGroup,
  openModal,
  lgpdPermissions,
}: EconomicGroupCardProps) {
  const hasHolding =
    economicGroup?.economic_group_holding &&
    Object.keys(economicGroup.economic_group_holding).length;

  const hasControlled =
    Array.isArray(economicGroup?.economic_group_controlled) &&
    economicGroup.economic_group_controlled.length;

  const formatDocumentValue = (taxId: string): string => {
    if (!taxId) return "";

    const cleanDocument = taxId.replace(/\D/g, "");

    if (cleanDocument.length === 11) {
      return formatLgpdCpf(cleanDocument, lgpdPermissions || {});
    } else if (cleanDocument.length === 14) {
      return formatLgpdCnpj(cleanDocument, lgpdPermissions || {});
    }

    return "***.***.***-**";
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Grupo Econômico
          </div>
          {hasPermissionEconomicGroup && accountId && (
            <Button onClick={openModal} variant={"ghost"}>
              <PencilSquareIcon className="w-5 h-5 cursor-pointer" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Holding Section */}
        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-medium text-muted-foreground">Holding</h4>
          {hasHolding ? (
            <div
              className="p-3 rounded-md bg-muted/30 border hover:bg-muted/50 transition-colors"
              role="listitem"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {economicGroup!.economic_group_holding!.name}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  {formatDocumentValue(
                    economicGroup!.economic_group_holding!.taxId
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center text-muted-foreground py-4">
              <div className="text-center">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Nenhuma holding cadastrada</p>
              </div>
            </div>
          )}
        </div>

        {/* Empresas Controladas Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Empresas Controladas
            </h4>
            {hasControlled && (
              <Badge variant="secondary" className="text-xs">
                {economicGroup!.economic_group_controlled!.length} empresa
                {economicGroup!.economic_group_controlled!.length !== 1
                  ? "s"
                  : ""}
              </Badge>
            )}
          </div>

          {hasControlled ? (
            <div
              className="flex-1 space-y-2 overflow-y-auto pr-2"
              role="list"
              aria-label="Lista de empresas controladas"
            >
              {economicGroup!.economic_group_controlled!.map(
                (company: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-md bg-muted/30 border hover:bg-muted/50 transition-colors"
                    role="listitem"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-foreground">
                        {company.name}
                      </p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {formatDocumentValue(company.taxId)}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center py-6">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">Nenhuma empresa controlada cadastrada</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
