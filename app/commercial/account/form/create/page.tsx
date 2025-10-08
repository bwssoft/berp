import { findOneAccount } from "@/app/lib/@backend/action/commercial/account.action";
import { findManyAddress } from "@/app/lib/@backend/action/commercial/address.action";
import { IContact } from "@/app/lib/@backend/domain";

import { BackButton } from '@/frontend/ui/component/back-button';
import { CreateOneAccountForm } from '@/frontend/ui/form/commercial/account/create/create.account.form';

import { AccountData } from "@/app/lib/@frontend/ui/page/commercial/account/tab/account/account.data";

interface Props {
    searchParams: { id: string };
}

export default async function Page({ searchParams }: Props) {
    const accountId = searchParams.id;
    const account = await findOneAccount({ id: accountId });
    const addresses = await findManyAddress({ accountId });
    const contacts: IContact[] = account?.contacts ?? [];

    return (
        <div className="space-y-6">
            <AccountData
                accountId={accountId}
                addresses={addresses}
                contacts={contacts}
            />

            <div className="w-2/5 ring-1 ring-inset ring-gray-200 bg-white rounded-md px-6 py-8">
                <div className="flex items-end gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">
                            Criar Nova Conta
                        </h1>
                        <p className="text-sm text-gray-600">
                            Preencha os dados para criar uma nova conta.
                        </p>
                    </div>
                </div>

                <div className="mt-8">
                    <CreateOneAccountForm />
                </div>
            </div>
        </div>
    );
}
