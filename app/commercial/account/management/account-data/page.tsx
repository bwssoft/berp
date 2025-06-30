import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component";

import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findManyAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import {
  AlertCircle,
  CheckCircle,
  Phone,
  MapPin,
  Plus,
  XCircle,
} from "lucide-react";
import ContactCard from "@/app/lib/@frontend/ui/card/commercial/account/contact.card";
import { AccountCard } from "@/app/lib/@frontend/ui/card/commercial/account/account.card";
import { EconomicGroupCard } from "@/app/lib/@frontend/ui/card/commercial/account/economic-group.card";
import { AddressCard } from "@/app/lib/@frontend/ui/card/commercial/account/address.card";
import { IAddress } from "@/app/lib/@backend/domain";
import { CreateContact } from "../../form/create/tab/contact/create-contact";
import { CreateAddressModal } from "../../form/create/tab/address/create-address";

interface Props {
  searchParams: {
    id: string;
  };
}

interface AddressCardListProps {
  items: IAddress[];
  className?: string;
}

export default async function Page({ searchParams }: Props) {
  const { id: accountId } = searchParams;
  const account = await findManyAccount({ id: accountId });
  const address = await findManyAddress({ accountId });

  const hasPermissionContacts = await restrictFeatureByProfile(
    "commercial:accounts:access:tab:data:contacts"
  );

  const hasPermissionAddresses = await restrictFeatureByProfile(
    "commercial:accounts:access:tab:data:addresses"
  );

  const _account = account.docs[0];

  const isCompany = _account.document.type === "cnpj";

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      {/* Seção Principal - Dados da Empresa + Grupo Econômico lado a lado com mesma altura */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <AccountCard account={_account} />

        {/* Card de Grupo Econômico - Lado Direito - Apenas para empresas */}
        {isCompany &&
          (_account.economic_group_holding ||
            _account.economic_group_controlled) && (
            <EconomicGroupCard account={_account} />
          )}
      </div>

      {/* Segunda linha - Contatos e Endereços com mesma altura */}
      <div className="grid grid-cols-1 gap-6 items-stretch">
        {/* Card de Contatos */}
        <Card className="w-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Phone className="h-5 w-5 text-primary" />
                Contatos
                <Badge variant="secondary" className="text-xs">
                  {account.docs[0].contacts?.length}
                </Badge>
              </CardTitle>
              {hasPermissionContacts && <CreateContact />}
            </div>
          </CardHeader>
          <CardContent className="flex gap-2">
            {(account.docs[0].contacts ?? [])?.map((contact, idx) => (
              <ContactCard
                key={contact.id ?? idx}
                contact={contact}
                accountId={accountId}
              />
            ))}
          </CardContent>
        </Card>

        {/* Card de Endereço */}
        <Card className="w-full">
          <CardHeader className="pb-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-primary" />
                Endereços
                {address?.length && (
                  <Badge variant="secondary" className="text-xs">
                    {address.length}
                  </Badge>
                )}
              </CardTitle>
              {hasPermissionAddresses && <CreateAddressModal id={accountId} />}
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="lg:col-span-2 h-full"></div>
            <div className="lg:col-span-2 h-full space-y-3">
              {address.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {address.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      title="Endereço:"
                      address={addr}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Nenhum endereço encontrado</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Cadastre um endereço para este cliente.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
  type?: "billing" | "situation" | "general";
}

export function StatusBadge({ status, type = "general" }: StatusBadgeProps) {
  const getStatusConfig = () => {
    if (type === "billing") {
      return status === "Ativo"
        ? {
            variant: "default" as const,
            icon: CheckCircle,
            className: "bg-green-100 text-green-800 border-green-200",
          }
        : {
            variant: "secondary" as const,
            icon: XCircle,
            className: "bg-red-100 text-red-800 border-red-200",
          };
    }

    if (type === "situation") {
      switch (status) {
        case "Adimplente":
          return {
            variant: "default" as const,
            icon: CheckCircle,
            className: "bg-green-100 text-green-800 border-green-200",
          };
        case "Inadimplente":
          return {
            variant: "destructive" as const,
            icon: AlertCircle,
            className: "bg-yellow-100 text-yellow-800 border-yellow-200",
          };
        case "Inadimplente/Bloqueado":
          return {
            variant: "destructive" as const,
            icon: XCircle,
            className: "bg-red-100 text-red-800 border-red-200",
          };
        default:
          return {
            variant: "secondary" as const,
            icon: AlertCircle,
            className: "",
          };
      }
    }

    return {
      variant: "outline" as const,
      icon: CheckCircle,
      className: "",
    };
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </Badge>
  );
}
