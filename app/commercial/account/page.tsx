import { findManyAccount } from "@/app/lib/@backend/action";
import { ContactCard } from "@/app/lib/@frontend/ui/list/comercial/contact/contact.card";

interface Props {
  searchParams: {
    id: string;
  };
}
export default async function Page({ searchParams }: Props) {
  const { id } = searchParams;
  const account = await findManyAccount({ id });
  return (
    <div>
      <h2>{account.docs[0].social_name}</h2>
      <div className="mt-5 border p-5 w-fit flex flex-col gap-2">
        <h3 className="font-semibold mb-5">Dados</h3>
        <div className="text-xs">
          <h4 className="font-semibold">Razão Social</h4>
          <span>{account.docs[0].social_name ?? ""}</span>
        </div>
        <div className="text-xs">
          <h4 className="font-semibold">Nome fantasia</h4>
          <span>{account.docs[0].fantasy_name ?? ""}</span>
        </div>
        <div className="text-xs">
          <h4 className="font-semibold">CNPJ</h4>
          <span>{account.docs[0].document.value ?? ""}</span>
        </div>
        <div className="text-xs">
          <h4 className="font-semibold">Inscrição Estadual</h4>
          <span>{account.docs[0].state_registration ?? ""}</span>
        </div>
        <div className="text-xs">
          <h4 className="font-semibold">Inscrição Municipal</h4>
          <span>{account.docs[0].municipal_registration ?? ""}</span>
        </div>
      </div>
      <div className="mt-5 border p-5 w-fit flex flex-col gap-2">
        <h3 className="font-semibold mb-5">Grupo Econômico</h3>
        <div className="text-xs">
          <h4 className="font-semibold">Holding / CNPJ</h4>
          <span>{account.docs[0].economic_group_holding ?? ""}</span>
        </div>
        <div className="text-xs">
          <h4 className="font-semibold">Empresas do Grupo / CNPJ</h4>
          {account.docs[0].economic_group_controlled &&
            account.docs[0].economic_group_controlled?.map((company, index) => (
              <span key={index}>{company} / cnpj</span>
            ))}
          {!account.docs[0].economic_group_controlled && (
            <span>Nenhuma empresa do grupo econômico cadastrada</span>
          )}
        </div>
      </div>
      <div className="mt-5 border p-5 w-fit flex flex-col gap-2">
        <h3 className="font-semibold mb-5">Contatos</h3>
        <div className="text-xs">
          {account.docs[0].contacts && account.docs[0].contacts.length > 0 && (
            <ContactCard accountId={id} />
          )}
        </div>
      </div>
    </div>
  );
}
