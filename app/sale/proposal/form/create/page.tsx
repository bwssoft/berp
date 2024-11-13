import { findAllClient, findAllProduct } from "@/app/lib/@backend/action";
import { ClientProposalCreateForm } from "@/app/lib/@frontend/ui";

export default async function Page() {
  const clients = await findAllClient();
  const products = await findAllProduct();
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Registro de proposta
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para registrar uma proposta.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <ClientProposalCreateForm clients={clients} products={products} />
      </div>
    </div>
  );
}
