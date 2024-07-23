import {
  findAllClient,
  findAllProduct,
  findOneClientOpportunity,
} from "@/app/lib/@backend/action";
import { ClientOpportunityUpdateForm } from "@/app/lib/@frontend/ui";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const clientOpportunity = await findOneClientOpportunity({ id });
  if (!clientOpportunity) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhuma Oportunidade encontrada
            </h1>
          </div>
        </div>
      </div>
    );
  }
  const clients = await findAllClient();
  const products = await findAllProduct();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Atualização de oportunidade
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar uma oportunidade.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ClientOpportunityUpdateForm
          products={products}
          clients={clients}
          clientOpportunity={clientOpportunity}
        />
      </div>
    </div>
  );
}
