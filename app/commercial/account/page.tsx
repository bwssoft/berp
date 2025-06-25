import { findManyAccount } from "@/app/lib/@backend/action";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { IAccount } from "@/app/lib/@backend/domain";
import { AccountFilterForm } from "@/app/lib/@frontend/ui/form/commercial/account/search/search.account.form";
import { AccountTable } from "@/app/lib/@frontend/ui/table/commercial/account";
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
    <div>
      <div className="flex justify-between items-center gap-6 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Contas
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Uma lista de todas as contas cadastradas na plataforma.
          </p>
        </div>

        {canCreate && (
          <Link
            href="/commercial/account/form/create"
            className="ml-10 flex items-center gap-x-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <PlusIcon className="-ml-1.5 h-5 w-5" aria-hidden="true" />
            Nova Conta
          </Link>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <AccountFilterForm />
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
        <AccountTable currentPage={_page} data={accountsWithPermissions} />
      </div>
    </div>
  );
}

function query(params: Props["searchParams"]): Filter<IAccount> {
  const conditions: Filter<IAccount>[] = [];

  const clean = (text: string) => text.replace(/[^\w]/g, "").toLowerCase();

  //   if (params.quick) {
  //     const regex = { $regex: params.quick, $options: "i" };
  //     conditions.push({
  //       $or: [
  //         { name: regex },
  //         { document: { value: { regex } } },
  //         { social_name: regex },
  //         { fantasy_name: regex },
  //       ],
  //     });
  //   }

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
