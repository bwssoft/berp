import { Users } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../component";
import { IAccount } from "@/app/lib/@backend/domain";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface EconomicGroupCardProps {
  account: IAccount;
  hasPermissionEconomicGroup: boolean;
  openModal: () => void;
}

export function EconomicGroupCard({
  account,
  hasPermissionEconomicGroup,
  openModal,
}: EconomicGroupCardProps) {
  const hasHolding =
    account.economic_group_holding &&
    Object.keys(account.economic_group_holding).length;
  const hasControlled =
    account.economic_group_controlled &&
    Array.isArray(account.economic_group_controlled) &&
    account.economic_group_controlled.length;
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-4 flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Grupo Econômico
          </div>
          {hasPermissionEconomicGroup && account.id && (
            <Button onClick={openModal} variant={"ghost"}>
              <PencilSquareIcon className="w-5 h-5 cursor-pointer" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Holding */}
        {hasHolding ? (
          <div className="space-y-3 mb-6">
            <div
              className="p-3 rounded-md bg-muted/30 border hover:bg-muted/50 transition-colors"
              role="listitem"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {account.economic_group_holding!.name}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  {account.economic_group_holding!.taxId}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* Empresas Controladas */}
        {hasControlled && account.economic_group_controlled!.length > 0 && (
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-muted-foreground">
                Empresas Controladas
              </h4>
              <Badge variant="secondary" className="text-xs">
                {account.economic_group_controlled!.length} empresa
                {account.economic_group_controlled!.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div
              className="flex-1 space-y-2 overflow-y-auto pr-2"
              role="list"
              aria-label="Lista de empresas controladas"
            >
              {account.economic_group_controlled!.map((company, index) => (
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
                      {company.taxId}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio quando não há grupo econômico */}
        {!hasHolding && !hasControlled && (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center py-8">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Nenhum grupo econômico cadastrado</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
