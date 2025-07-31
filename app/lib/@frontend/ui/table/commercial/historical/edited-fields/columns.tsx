import { ColumnDef } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../component/tooltip";

export const columns: ColumnDef<{key: string, oldValue: string, newValue: string}>[] = [
    { 
        header: "Campo atualizado", 
        accessorKey: "key",  
        cell: ({row}) => {
            const type = row.original.key
            return (
                <div className="w-44 truncate overflow-hidden whitespace-nowrap">
                    {accountFieldLabelsMapping[type]}
                </div>
            )
        }
    },
    {
        header: "Valor anterior",
        accessorKey: "oldValue",
        cell: ({ row }) => {
            const value =  row.original.oldValue ?? "-";
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
            )
        },
    },
    {
        header: "Valor atualizado",
        accessorKey: "newValue",
        cell: ({ row }) => {
            const value =  row.original.newValue ?? "-";
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
            )
        },
    }
];

export const accountFieldLabelsMapping: Record<string, string> = {
  document: "Documento",
  "document.value": "Número do documento",
  "document.type": "Tipo de documento",
  name: "Nome",
  rg: "RG",
  social_name: "Razão social",
  fantasy_name: "Nome fantasia",
  state_registration: "Inscrição estadual",
  municipal_registration: "Inscrição municipal",
  status: "Status",
  setor: "Setor",
  address: "Endereço",
  contacts: "Contatos",
  economic_group_holding: "Grupo econômico (holding)",
  "economic_group_holding.name": "Nome da holding",
  "economic_group_holding.taxId": "CNPJ da holding",
  economic_group_controlled: "Empresas controladas",
  billing_status: "Status de cobrança",
  billing_situation: "Situação de cobrança",
  last_billing_date: "Última cobrança",
  created_at: "Data de criação",
  updated_at: "Data de atualização",
};
