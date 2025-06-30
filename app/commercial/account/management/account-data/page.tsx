import { IAddress } from "@/app/lib/@backend/domain";
import {
    Badge,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    InfoField,
    SectionCard,
} from "@/app/lib/@frontend/ui/component";
import { AddressCard } from "@/app/lib/@frontend/ui/card/commercial/account/address.card";
import { ContactCard } from "@/app/lib/@frontend/ui/list/comercial/contact/contact.card";
import {
    SearchContactModal,
    UpdateEconomicGroupAccountModal,
} from "@/app/lib/@frontend/ui/modal";
import { CreateContact } from "../../form/create/tab/contact/create-contact";
import { CreateAddressModal } from "../../form/create/tab/address/create-address";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findManyAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import {
    AlertCircle,
    Building2,
    CheckCircle,
    DollarSign,
    Tag,
    User,
    Users,
    XCircle,
} from "lucide-react";
import { Separator } from "@/app/lib/@frontend/ui/component/separator";
import { AccountCard } from "@/app/lib/@frontend/ui/card/commercial/account/account.card";
import { EconomicGroupCard } from "@/app/lib/@frontend/ui/card/commercial/account/economic-group.card";

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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                {/* Card de Contatos */}
                <div className="lg:col-span-1 h-full"></div>

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
                                <CardTitle>
                                    Nenhum endereço encontrado
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>Cadastre um endereço para este cliente.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Card de Endereços - Ocupa 2 colunas */}
                <div className="lg:col-span-2 h-full"></div>
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
                        className:
                            "bg-green-100 text-green-800 border-green-200",
                    };
                case "Inadimplente":
                    return {
                        variant: "destructive" as const,
                        icon: AlertCircle,
                        className:
                            "bg-yellow-100 text-yellow-800 border-yellow-200",
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
