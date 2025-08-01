import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { findManyAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { IAccount } from "@/app/lib/@backend/domain";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/lib/@frontend/ui/component";
import { AccountFilterForm } from "@/app/lib/@frontend/ui/form/commercial/account/search/search.account.form";
import { AccountTable } from "@/app/lib/@frontend/ui/table/commercial/account/account.table";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
  searchParams: {
    quick?: string;
    page?: string;
    start_date?: string;
    end_date?: string;
    external?: string[] | string;
    client?: string;
    document?: string;
    sector?: string;
    status?: string;
    billingSituation?: string;
  };
}

export default async function Page(props: Props) {
  const {
    searchParams: { page, ...rest },
  } = props;
  const _page = page ? Number(page) : 1;

  const accounts = await findManyAccount(query(rest), _page);

  const canCreate = await restrictFeatureByProfile("commercial:accounts:new");
  const canViewFullLgpd = await restrictFeatureByProfile(
    "commercial:accounts:view:lgpd:full"
  );
  const canViewPartialLgpd = await restrictFeatureByProfile(
    "commercial:accounts:view:lgpd:partial"
  );

  const accountsWithPermissions = {
    ...accounts,
    docs: accounts.docs.map((account) => ({
      ...account,
      _permissions: {
        fullLgpdAccess: canViewFullLgpd,
        partialLgpdAccess: canViewPartialLgpd,
      },
    })),
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contas</h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todas as contas cadastradas
          </p>
        </div>
        {canCreate && (
          <Link href="/commercial/account/form/create">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Nova Conta
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
          <AccountFilterForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado</CardTitle>
          <CardDescription>
            Veja abaixo a lista de contas encontradas com base nos filtros
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountTable currentPage={_page} data={accountsWithPermissions} />
        </CardContent>
      </Card>
    </div>
  );
}

function query(params: Props["searchParams"]): Filter<IAccount> {
  const conditions: Filter<IAccount>[] = [];

  if (params.client) {
    const regex = { $regex: params.client, $options: "i" };
    conditions.push({
      $or: [{ name: regex }, { fantasy_name: regex }, { social_name: regex }],
    });
  }

  if (params.document) {
    conditions.push({
      "document.value": { $regex: params.document, $options: "i" },
    });
  }

  if (params.sector) {
    conditions.push({
      setor: { $in: [params.sector] },
    });
  }

  if (params.status && params.status !== "Todos") {
    conditions.push({
      status: params.status as "Ativo" | "Inativo",
    });
  }

  if (params.billingSituation === "Regular") {
    conditions.push({
      billing_situation: "Adimplente",
    });
  } else if (params.billingSituation === "Irregular") {
    conditions.push({
      billing_situation: { $ne: "Adimplente" },
    });
  }

  if (params.start_date || params.end_date) {
    const range: Record<string, Date> = {};
    if (params.start_date) range.$gte = new Date(params.start_date);
    if (params.end_date) range.$lte = new Date(params.end_date);
    conditions.push({ created_at: range });
  }

  if (params.external) {
    const values = Array.isArray(params.external)
      ? params.external.map((v) => v === "true")
      : [params.external === "true"];
    conditions.push({ external: { $in: values } });
  }

  if (conditions.length === 1) {
    return conditions[0];
  }

  if (conditions.length > 1) {
    return { $and: conditions };
  }

  return {};
}
