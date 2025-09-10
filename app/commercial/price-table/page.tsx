import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findManyPriceTable } from "@/app/lib/@backend/action/commercial/price-table.action";
import { IPriceTable } from "@/app/lib/@backend/domain";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component";
import { PriceTableFilterForm } from "@/app/lib/@frontend/ui/form/commercial/price-table/search/search.price-table.form";
import { PriceTableTable } from "@/app/lib/@frontend/ui/table/commercial/price-table/price-table.table";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
  searchParams: {
    page?: string;
    name?: string;
    type?: string;
    status?: string;
    created_date?: string;
    activation_date?: string;
    start_date?: string;
    end_date?: string;
  };
}

export default async function PriceTablePage(props: Props) {
  const {
    searchParams: { page, ...rest },
  } = props;
  const _page = page ? Number(page) : 1;

  const priceTables = await findManyPriceTable(query(rest), _page);
  const canCreate = await restrictFeatureByProfile("commercial:price-table:create");
  const canEdit = await restrictFeatureByProfile("commercial:price-table:edit");

  return (
    <div className="space-y-4 pt-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tabela de Preços</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as tabelas de preços
          </p>
        </div>
        {canCreate && (
          <Link href="/commercial/price-table/form/create">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nova Tabela
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de busca</CardTitle>
          <CardDescription>
            Preencha os filtros abaixo e clique em &quot;Pesquisar&quot;
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PriceTableFilterForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
          <CardDescription>
            Veja abaixo a lista de tabelas de preços encontradas com base nos
            filtros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PriceTableTable
            currentPage={_page}
            restrictEdit={canEdit}
            data={
              priceTables ?? { docs: [], pages: 0, total: 0, limit: 10 }
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

function query(params: Props["searchParams"]): Filter<IPriceTable> {
  const conditions: Filter<IPriceTable>[] = [];

  if (params.name) {
    conditions.push({
      name: { $regex: params.name, $options: "i" },
    });
  }

  if (params.type && params.type !== "Todos") {
    conditions.push({
      isTemporary: params.type === "Provisória",
    });
  }

  if (params.status && params.status !== "Todos") {
    conditions.push({
      status: params.status as any, // Status filtering - cast to avoid type issues
    });
  }

  // Handle created_date filter
  if (params.created_date) {
    conditions.push({
      created_at: new Date(params.created_date),
    });
  }

  // Handle activation_date filter
  if (params.activation_date) {
    conditions.push({
      startDateTime: new Date(params.activation_date),
    });
  }

  // Handle period filter (start_date and end_date)
  if (params.start_date || params.end_date) {
    const range: Record<string, Date> = {};
    if (params.start_date) range.$gte = new Date(params.start_date);
    if (params.end_date) range.$lte = new Date(params.end_date);
    conditions.push({ startDateTime: range });
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  if (conditions.length > 1) {
    return { $and: conditions };
  }

  return {};
}
