import {
  findManyClient,
  findAllNegotiationType,
  findManyProduct,
} from "@/app/lib/@backend/action";
import { ProposalCreateForm } from "@/app/lib/@frontend/ui/component";

export default async function Page() {
  const [clients, { docs: products }, negotiationType] = await Promise.all([
    findManyClient({}),
    findManyProduct({ filter: {} }),
    findAllNegotiationType(),
  ]);
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
        <ProposalCreateForm
          clients={clients}
          products={products}
          negotiationType={negotiationType}
        />
      </div>
    </div>
  );
}
