import { findManyAccount, findManyAddress } from "@/app/lib/@backend/action";
import { IAddress } from "@/app/lib/@backend/domain";
import { InfoField, SectionCard } from "@/app/lib/@frontend/ui/component";
import { AddressCard } from "@/app/lib/@frontend/ui/list/comercial/address/address.card";
import { ContactCard } from "@/app/lib/@frontend/ui/list/comercial/contact/contact.card";

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
    <div className="grid grid-cols-2 gap-2">
      <h2>{acc.social_name}</h2>
      <div className="grid grid-cols-2 gap-2 col-span-2">
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
          <InfoField
            label="Holding / CNPJ"
            value={acc.economic_group_holding}
          />
          <div className="text-xs w-full">
            <h4 className="font-semibold">Empresas do Grupo / CNPJ</h4>
            {acc.economic_group_controlled?.length ? (
              acc.economic_group_controlled.map((company, index) => (
                <span key={index}>{company} / cnpj</span>
              ))
            ) : (
              <span>Nenhuma empresa do grupo econômico cadastrada</span>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard className="col-span-2" title="Contatos">
        {(acc.contacts ?? []).length > 0 && (
          <div className="text-xs">
            <ContactCard accountId={accountId} />
          </div>
        )}
      </SectionCard>

      <SectionCard className="col-span-2" title="Endereços">
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
