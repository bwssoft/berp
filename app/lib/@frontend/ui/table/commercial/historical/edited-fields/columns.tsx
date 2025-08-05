import { ColumnDef } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../component/tooltip";

export const columns: ColumnDef<{
  key: string;
  oldValue: string;
  newValue: string;
}>[] = [
  {
    header: "Campo atualizado",
    accessorKey: "key",
    cell: ({ row }) => {
      const type = row.original.key;
      const mappedValue = fieldLabelsMapping[type] || type;

      return (
        <div className="w-44">
          {Array.isArray(mappedValue) ? (
            <div className="space-y-1">
              <div className="text-xs text-gray-500 font-medium">
                Array ({mappedValue.length} item
                {mappedValue.length !== 1 ? "s" : ""})
              </div>
              <div className="text-xs bg-gray-50 p-2 rounded border max-h-24 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-xs">
                  {JSON.stringify(mappedValue, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="truncate overflow-hidden whitespace-nowrap">
              {mappedValue}
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Valor anterior",
    accessorKey: "oldValue",
    cell: ({ row }) => {
      const value = row.original.oldValue ?? "-";

      const isJsonArray =
        typeof value === "string" &&
        value.startsWith("[") &&
        value.endsWith("]");

      if (isJsonArray) {
        const parsed = JSON.parse(value);
        const isArray = Array.isArray(parsed);

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-96">
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    {isArray
                      ? `Array (${parsed.length} item${parsed.length !== 1 ? "s" : ""})`
                      : "Object"}
                  </div>
                  <div className="text-xs bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(parsed, null, 2)}
                    </pre>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-md">
                <pre className="whitespace-pre-wrap text-xs max-h-64 overflow-y-auto">
                  {JSON.stringify(parsed, null, 2)}
                </pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-36 truncate overflow-hidden whitespace-nowrap">
                {value}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    header: "Valor atualizado",
    accessorKey: "newValue",
    cell: ({ row }) => {
      const value = row.original.newValue ?? "-";

      // Check if the value looks like a JSON array or object
      const isJsonArray =
        typeof value === "string" &&
        value.startsWith("[") &&
        value.endsWith("]");

      if (isJsonArray) {
        const parsed = JSON.parse(value);
        const isArray = Array.isArray(parsed);

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-96">
                  <div className="text-xs text-gray-500 font-medium mb-1">
                    {isArray
                      ? `Array (${parsed.length} item${parsed.length !== 1 ? "s" : ""})`
                      : "Object"}
                  </div>
                  <div className="text-xs bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs">
                      {JSON.stringify(parsed, null, 2)}
                    </pre>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-md">
                <pre className="whitespace-pre-wrap text-xs max-h-64 overflow-y-auto">
                  {JSON.stringify(parsed, null, 2)}
                </pre>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-36 truncate overflow-hidden whitespace-nowrap">
                {value}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{value}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

export const fieldLabelsMapping: Record<string, string> = {
  // Document fields
  document: "Documento",
  "document.value": "Número do documento",
  "document.type": "Tipo de documento",

  // Account/Client general fields
  name: "Nome",
  rg: "RG",
  social_name: "Razão social",
  fantasy_name: "Nome fantasia",
  state_registration: "Inscrição estadual",
  municipal_registration: "Inscrição municipal",
  status: "Status",
  setor: "Setor",

  // Economic group fields
  economic_group_holding: "Grupo econômico (holding)",
  "economic_group_holding.name": "Nome da holding",
  "economic_group_holding.taxId": "CNPJ da holding",
  economic_group_controlled: "Empresas controladas",

  // Billing fields
  billing_status: "Status de cobrança",
  billing_situation: "Situação de cobrança",
  last_billing_date: "Última cobrança",

  // System fields
  created_at: "Data de criação",
  updated_at: "Data de atualização",

  // Address fields
  address: "Endereços",
  "address.street": "Logradouro",
  "address.district": "Bairro",
  "address.city": "Cidade",
  "address.zip_code": "CEP",
  "address.state": "Estado",
  "address.number": "Número",
  "address.complement": "Complemento",
  "address.reference_point": "Ponto de referência",
  "address.type": "Tipo de endereço",
  "address.default_address": "Endereço padrão",
  street: "Logradouro",
  district: "Bairro",
  city: "Cidade",
  zip_code: "CEP",
  state: "Estado",
  number: "Número",
  complement: "Complemento",
  reference_point: "Ponto de referência",
  type: "Tipo",
  default_address: "Endereço padrão",

  // Contact fields
  contacts: "Contatos",
  "contacts.name": "Nome do contato",
  "contacts.positionOrRelation": "Cargo ou relação",
  "contacts.department": "Departamento",
  "contacts.cpf": "CPF do contato",
  "contacts.rg": "RG do contato",
  "contacts.contractEnabled": "Contrato habilitado",
  "contacts.originType": "Origem do contato",
  "contacts.contactFor": "Contato para",
  "contacts.contactItems": "Itens de contato",
  "contacts.taxId": "CNPJ do contato",
  contractEnabled: "Contrato habilitado",
  positionOrRelation: "Cargo ou relação",
  department: "Departamento",
  cpf: "CPF",
  originType: "Origem do contato",
  contactFor: "Contato para",
  contactItems: "Itens de contato",
  taxId: "CNPJ",

  // Contact item fields
  "contactItems.type": "Tipo de contato",
  "contactItems.contact": "Informação de contato",
  "contactItems.preferredContact": "Contato preferencial",
  "contactItems.preferredContact.phone": "Telefone preferencial",
  "contactItems.preferredContact.whatsapp": "WhatsApp preferencial",
  "contactItems.preferredContact.email": "Email preferencial",
};
