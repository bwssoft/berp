import { findManyAccount, findManyAddress } from "@/app/lib/@backend/action";
import { IAddress } from "@/app/lib/@backend/domain";
import { InfoField, SectionCard } from "@/app/lib/@frontend/ui/component";
import { AddressCard } from "@/app/lib/@frontend/ui/list/comercial/address/address.card";
import { ContactCard } from "@/app/lib/@frontend/ui/list/comercial/contact/contact.card";
import {
    SearchContactModal,
    UpdateEconomicGroupAccountModal,
} from "@/app/lib/@frontend/ui/modal";
import { CreateContact } from "../../form/create/tab/contact/create-contact";
import { CreateAddressModal } from "../../form/create/tab/address/create-address";

interface Props {
    searchParams: {
        id: string;
    };
}

export default async function Page({ searchParams }: Props) {
    const { id: accountId } = searchParams;
    const account = await findManyAccount({ id: accountId });
    const address = await findManyAddress({ accountId });

    const acc = account.docs[0];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <h2>{acc.social_name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 col-span-2">
                <SectionCard title="Dados">
                    <InfoField label="Razão Social" value={acc.social_name} />
                    <InfoField label="Nome fantasia" value={acc.fantasy_name} />
                    <InfoField label="CNPJ" value={acc.document?.value} />
                    <InfoField
                        label="Inscrição Estadual"
                        value={acc.state_registration}
                    />
                    <InfoField
                        label="Inscrição Municipal"
                        value={acc.municipal_registration}
                    />
                </SectionCard>

                <SectionCard title="Grupo Econômico">
                    <div className="flex gap-2">
                        <InfoField
                            label="Holding (CNPJ)"
                            value={`${acc.economic_group_holding?.name} / ${acc.economic_group_holding?.taxId}`}
                        />
                        <UpdateEconomicGroupAccountModal
                            accountId={accountId}
                        />
                    </div>
                    <div className="text-xs w-full mt-2">
                        <h4 className="font-semibold">
                            Empresas do Grupo (CNPJ)
                        </h4>
                        <div className="flex flex-col ">
                            {acc.economic_group_controlled?.length ? (
                                acc.economic_group_controlled.map(
                                    (company, index) => (
                                        <p key={index}>
                                            {company.name + " / "}{" "}
                                            <span className="text-gray-700">
                                                {company.taxId}
                                            </span>
                                        </p>
                                    )
                                )
                            ) : (
                                <span>
                                    Nenhuma empresa do grupo econômico
                                    cadastrada
                                </span>
                            )}
                        </div>
                    </div>
                </SectionCard>
            </div>

            <SectionCard className="col-span-2" title="Contatos">
                <div className="flex gap-2 items-end justify-end w-full">
                    <SearchContactModal accountId={accountId} />
                    <CreateContact />
                </div>
                {(acc.contacts ?? []).length > 0 && (
                    <div className="text-xs">
                        <ContactCard accountId={accountId} />
                    </div>
                )}
            </SectionCard>

            <SectionCard className="col-span-2" title="Endereços">
                <CreateAddressModal id={accountId} />
                <div className="text-xs">
                    {address.length > 0 ? (
                        address.map((addr: IAddress, idx: number) => (
                            <AddressCard key={idx} address={addr} />
                        ))
                    ) : (
                        <span>Nenhum endereço cadastrado</span>
                    )}
                </div>
            </SectionCard>
        </div>
    );
}
