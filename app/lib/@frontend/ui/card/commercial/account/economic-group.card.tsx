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
  const hasHolding = !!(
    account.economic_group_holding &&
    Object.keys(account.economic_group_holding).length
  );

  const hasControlled = !!(
    Array.isArray(account.economic_group_controlled) &&
    account.economic_group_controlled.length
  );

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
                  {account.economic_group_holding!.name}
                </p>
                <p className="text-xs font-mono text-muted-foreground">
                  {account.economic_group_holding!.taxId}
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
                {account.economic_group_controlled!.length} empresa
                {account.economic_group_controlled!.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          {hasControlled ? (
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
