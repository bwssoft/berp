import { findManyAccount } from "@/app/lib/@backend/action";

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
    </div>
  );
}
