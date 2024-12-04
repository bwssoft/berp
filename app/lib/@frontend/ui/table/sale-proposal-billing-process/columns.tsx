import { IProduct, IProposal } from "@/app/lib/@backend/domain";
import { clientConstants } from "@/app/lib/constant";
import { cn } from "@/app/lib/util";
import { ColumnDef } from "@tanstack/react-table";
import { UseFormRegister } from "react-hook-form";
import { ClientProposalSchema } from "../../form/client-proposal/update/use-client-proposal-update-form";

export const columns = (props: {
  register: UseFormRegister<ClientProposalSchema>;
  scenario: IProposal["scenarios"][number];
  products: IProduct[];
}): ColumnDef<NonNullable<IProposal["billing_process"]>[string][number]>[] => {
  const { register, products, scenario } = props;
  return [
    {
      header: "Empresa Omie",
      accessorKey: "omie_enterprise",
      cell: ({ row }) => {
        const input = row.original;
        return input.omie_enterprise;
      },
    },
    {
      header: "Produtos",
      accessorKey: "product",
      cell: ({ row }) => {
        const input = row.original;
        return input.line_item_id
          .map((id) => {
            const line_time = scenario.line_items.find((el) => el.id === id);
            return products.find((p) => p.id === line_time?.product_id)?.name;
          })
          .join(", ");
      },
    },
    {
      header: "Quantidade de parcelas",
      accessorKey: "quantity",
      cell: ({ row }) => {
        return (
          <select
            id="client_id"
            className="border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4"
            {...register(
              `billing_process.${scenario.id}.${row.index}.installment_quantity`
            )}
          >
            {clientConstants.proposalInstallment.map((c) => (
              <option key={c.id} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      header: "Número do pedido omie",
      accessorKey: "omie_sale_order_id",
      cell: ({ row }) => {
        const input = row.original;
        return input.omie_sale_order_id ? (
          input.omie_sale_order_id
        ) : (
          <button
            type="button"
            className={cn(
              "border border-gray-300 bg-white shadow-sm hover:bg-gray-200 inline-flex items-center gap-2 justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4"
            )}
            disabled={typeof input.installment_quantity !== "number"}
          >
            Criar pedido na omie
          </button>
        );
      },
    },
  ];
};
