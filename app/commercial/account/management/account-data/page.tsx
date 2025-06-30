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
import { AddressCard } from "@/app/lib/@frontend/ui/list/comercial/address/address.card";
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

interface Props {
  searchParams: {
    id: string;
  };
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

  const hasPermissionEconomicGroup = await restrictFeatureByProfile(
    "commercial:accounts:access:tab:data:group-edit"
  );

  const _acccount = account.docs[0];

  const isCompany = _acccount.document.type === "cnpj";
  const displayName = isCompany
    ? _acccount.social_name || _acccount.fantasy_name
    : _acccount.name;

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-6">
      {/* Seção Principal - Dados da Empresa + Grupo Econômico lado a lado com mesma altura */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        {/* Card de Dados Principais - Lado Esquerdo */}
        <Card className="flex flex-col h-full">
          <CardHeader className="pb-4 flex-shrink-0">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCompany ? (
                  <Building2 className="h-5 w-5 text-primary" />
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
                {isCompany ? "Dados da Empresa" : "Dados Pessoais"}
              </div>
              <Badge variant="outline" className="text-xs">
                {_acccount.document.type.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Grid otimizado para melhor uso do espaço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {isCompany ? (
                <>
                  <InfoField
                    label="Razão Social"
                    value={_acccount.social_name}
                  />
                  <InfoField
                    label="Nome Fantasia"
                    value={_acccount.fantasy_name}
                  />
                  <InfoField label="CNPJ" value={_acccount.document.value} />
                  <InfoField
                    label="Inscrição Estadual"
                    value={_acccount.state_registration}
                  />
                  <InfoField
                    label="Inscrição Municipal"
                    value={_acccount.municipal_registration}
                  />
                  {/* Campo adicional para preencher o grid se necessário */}
                  {_acccount.status && (
                    <div className="space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Status Geral
                      </dt>
                      <dd className="flex items-center">
                        <StatusBadge status={_acccount.status} type="general" />
                      </dd>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <InfoField label="Nome" value={_acccount.name} />
                  <InfoField label="CPF" value={_acccount.document.value} />
                  <InfoField label="RG" value={_acccount.rg} />
                  {_acccount.status && (
                    <div className="space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">
                        Status
                      </dt>
                      <dd className="flex items-center">
                        <StatusBadge status={_acccount.status} type="general" />
                      </dd>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Seção de Status de Cobrança e Setores */}
            {(_acccount.billing_status ||
              _acccount.billing_situation ||
              (_acccount.setor && _acccount.setor.length > 0)) && (
              <>
                <Separator className="mb-6" />
                <div className="space-y-6 flex-1">
                  {/* Status de Cobrança */}
                  {(_acccount.billing_status ||
                    _acccount.billing_situation) && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        Status de Cobrança
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {_acccount.billing_status && (
                          <StatusBadge
                            status={_acccount.billing_status}
                            type="billing"
                          />
                        )}
                        {_acccount.billing_situation && (
                          <StatusBadge
                            status={_acccount.billing_situation}
                            type="situation"
                          />
                        )}
                      </div>
                      {_acccount.last_billing_date && (
                        <div className="text-xs text-muted-foreground">
                          Última cobrança:{" "}
                          <span className="font-mono">
                            {_acccount.last_billing_date.toLocaleString() ||
                              "----"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Setores */}
                  {_acccount.setor && _acccount.setor.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        Setores de Atuação
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {_acccount.setor.map((setor, index) => (
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
                    {_acccount.created_at?.toLocaleString()}
                  </dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">
                    Última Atualização
                  </dt>
                  <dd className="text-sm font-mono text-muted-foreground">
                    {_acccount.updated_at?.toLocaleString() || "----"}
                  </dd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card de Grupo Econômico - Lado Direito - Apenas para empresas */}
        {isCompany &&
          (_acccount.economic_group_holding ||
            _acccount.economic_group_controlled) && (
            <Card className="flex flex-col h-full">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Grupo Econômico
                  </div>
                  {/* Botão de editar movido para o header */}
                  {hasPermissionEconomicGroup && _acccount.id && (
                    // <UpdateEconomicGroupAccountModal
                    //   _acccountId={_acccount.id}
                    // />

                    <div></div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* Holding */}
                {_acccount.economic_group_holding && (
                  <div className="space-y-3 mb-6">
                    <InfoField
                      label="Empresa Holding"
                      value={`${_acccount.economic_group_holding.name} / ${_acccount.economic_group_holding.taxId}`}
                    />
                  </div>
                )}

                {/* Empresas Controladas */}
                {_acccount.economic_group_controlled &&
                  _acccount.economic_group_controlled.length > 0 && (
                    <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Empresas Controladas
                        </h4>
                        <Badge variant="secondary" className="text-xs">
                          {_acccount.economic_group_controlled.length} empresa
                          {_acccount.economic_group_controlled.length !== 1
                            ? "s"
                            : ""}
                        </Badge>
                      </div>

                      <div
                        className="flex-1 space-y-2 overflow-y-auto pr-2"
                        role="list"
                        aria-label="Lista de empresas controladas"
                      >
                        {_acccount.economic_group_controlled.map(
                          (company, index) => (
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
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Estado vazio quando não há grupo econômico */}
                {!_acccount.economic_group_holding &&
                  (!_acccount.economic_group_controlled ||
                    _acccount.economic_group_controlled.length === 0) && (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <div className="text-center py-8">
                        <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">
                          Nenhum grupo econômico cadastrado
                        </p>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}

        {/* Card placeholder quando não há grupo econômico - mantém altura igual */}
        {isCompany &&
          !_acccount.economic_group_holding &&
          (!_acccount.economic_group_controlled ||
            _acccount.economic_group_controlled.length === 0) && (
            <Card className="flex flex-col h-full opacity-30">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">Grupo Econômico</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-10 w-10 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nenhum grupo econômico cadastrado</p>
                </div>
              </CardContent>
            </Card>
          )}
      </div>

      {/* Segunda linha - Contatos e Endereços com mesma altura */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Card de Contatos */}
        <div className="lg:col-span-1 h-full"></div>

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

    return { variant: "outline" as const, icon: CheckCircle, className: "" };
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
