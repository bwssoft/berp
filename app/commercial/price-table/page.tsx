import { restrictFeatureByProfile } from "@/backend/action/auth/restrict.action";
import { findManyPriceTable } from "@/backend/action/commercial/price-table.action";
import {IPriceTable} from "@/backend/domain/commercial/entity/price-table.definition";
import { Button } from '@/frontend/ui/component/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/frontend/ui/component/card';

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
  const canCreate = await restrictFeatureByProfile(
    "commercial:price-table:create"
  );
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
            restrictClone={canCreate}
            data={priceTables ?? { docs: [], pages: 0, total: 0, limit: 10 }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function query(params: Props["searchParams"]): Filter<IPriceTable> {
  const conditions: Filter<IPriceTable>[] = [];

  // Add each filter condition
  addNameFilter(conditions, params.name);
  addTypeFilter(conditions, params.type);
  addStatusFilter(conditions, params.status);
  addCreatedDateFilter(conditions, params.created_date);
  addActivationDateFilter(conditions, params.activation_date);
  addPeriodFilter(conditions, params.start_date, params.end_date);

  return buildFinalQuery(conditions);
}

function addNameFilter(conditions: Filter<IPriceTable>[], name?: string): void {
  if (!name) return;

  conditions.push({
    name: { $regex: name, $options: "i" },
  });
}

function addTypeFilter(conditions: Filter<IPriceTable>[], type?: string): void {
  if (!type || type === "Todos") return;

  conditions.push({
    isTemporary: type === "Provisória",
  });
}

function addStatusFilter(
  conditions: Filter<IPriceTable>[],
  status?: string
): void {
  if (!status || status === "Todos") return;

  conditions.push({
    status: status as any,
  });
}

function addCreatedDateFilter(
  conditions: Filter<IPriceTable>[],
  dateString?: string
): void {
  if (!dateString) return;

  const { startOfDay, endOfDay } = parseDateToRange(dateString);

  conditions.push({
    created_at: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
}

function addActivationDateFilter(
  conditions: Filter<IPriceTable>[],
  dateString?: string
): void {
  if (!dateString) return;

  const { startOfDay, endOfDay } = parseDateToRange(dateString);

  conditions.push({
    startDateTime: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });
}

function addPeriodFilter(
  conditions: Filter<IPriceTable>[],
  startDate?: string,
  endDate?: string
): void {
  if (!startDate && !endDate) return;

  if (startDate && endDate) {
    addFullPeriodFilter(conditions, startDate, endDate);
  } else if (startDate) {
    addStartDateOnlyFilter(conditions, startDate);
  } else if (endDate) {
    addEndDateOnlyFilter(conditions, endDate);
  }
}

function addFullPeriodFilter(
  conditions: Filter<IPriceTable>[],
  startDate: string,
  endDate: string
): void {
  const inputStartDate = parseToStartOfDay(startDate);
  const inputEndDate = parseToEndOfDay(endDate);

  // Tables must be completely within the input period
  conditions.push({
    $and: [
      { startDateTime: { $gte: inputStartDate } }, // Table starts after input starts
      { endDateTime: { $lte: inputEndDate } }, // Table ends before input ends
    ],
  });
}

function addStartDateOnlyFilter(
  conditions: Filter<IPriceTable>[],
  startDate: string
): void {
  const inputStartDate = parseToStartOfDay(startDate);

  conditions.push({
    startDateTime: { $gte: inputStartDate },
  });
}

function addEndDateOnlyFilter(
  conditions: Filter<IPriceTable>[],
  endDate: string
): void {
  const inputEndDate = parseToEndOfDay(endDate);

  conditions.push({
    endDateTime: { $lte: inputEndDate },
  });
}

function parseDateToRange(dateString: string): {
  startOfDay: Date;
  endOfDay: Date;
} {
  const [year, month, day] = dateString.split("-").map(Number);

  return {
    startOfDay: new Date(year, month - 1, day, 0, 0, 0, 0),
    endOfDay: new Date(year, month - 1, day, 23, 59, 59, 999),
  };
}

function parseToStartOfDay(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
}

function parseToEndOfDay(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day, 23, 59, 59, 999);
}

function buildFinalQuery(
  conditions: Filter<IPriceTable>[]
): Filter<IPriceTable> {
  if (conditions.length === 0) return {};
  if (conditions.length === 1) return conditions[0];
  return { $and: conditions };
}

