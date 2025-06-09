import { findManyAccount } from "@/app/lib/@backend/action";
import { restrictFeatureByProfile } from "@/app/lib/@backend/action/auth/restrict.action";
import { IAccount } from "@/app/lib/@backend/domain";
import { Button } from "@/app/lib/@frontend/ui/component";
import { AccountFilterForm } from "@/app/lib/@frontend/ui/form/commercial/account/search/search.account.form";
import { AccountTable } from "@/app/lib/@frontend/ui/table/commercial/account";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Filter } from "mongodb";
import Link from "next/link";

interface Props {
    searchParams: {
        quick?: string;
        page?: string;
        start_date?: Date;
        end_date?: Date;
        external?: string[] | string;
    };
}

export default async function Page(props: Props) {
    const {
        searchParams: { page, ...rest },
    } = props;
    const _page = page?.length ? Number(page) : undefined;
    const accounts = await findManyAccount(query(rest), _page);
    //   const canCreate = await restrictFeatureByProfile("commercial:account:create");

    return (
        <div>
            <div className="flex justify-end">
                {
                    //canCreate && (
                    <Button variant={"default"}>Nova Conta</Button>
                    // )
                }
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
                <AccountFilterForm />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8 space-y-12">
                <AccountTable currentPage={_page} data={accounts} />
            </div>
        </div>
    );
}

function query(params: Props["searchParams"]): Filter<IAccount> {
    const conditions: Filter<IAccount>[] = [];

    if (params.quick) {
        const regex = { $regex: params.quick, $options: "i" };
        conditions.push({
            $or: [
                { name: regex },
                { "document.value": regex },
                { social_name: regex },
                { fantasy_name: regex },
            ],
        });
    }

    if (params.start_date || params.end_date) {
        const range: Record<string, Date> = {};
        if (params.start_date) range.$gte = new Date(params.start_date);
        if (params.end_date) range.$lte = new Date(params.end_date);
        conditions.push({ created_at: range });
    }

    if (params.external) {
        const values =
            typeof params.external === "string"
                ? [params.external === "true"]
                : params.external.map((v) => v === "true");
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
