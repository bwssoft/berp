import {
  findAllClient,
  findAllNegotiationType,
  findAllProduct,
  findOneClient,
  findOneFinancialOrder,
} from "@/app/lib/@backend/action";
import { findOneClientProposal } from "@/app/lib/@backend/action";
import { ClientProposalUpdateForm } from "@/app/lib/@frontend/ui/form/commercial/proposal";
import { FinancialOrderCreateForm } from "@/app/lib/@frontend/ui/form/financial/create/financial-order-create-form";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const proposal = await findOneClientProposal({ id });
  if (!proposal) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Nenhuma Proposta encontrada
            </h1>
          </div>
        </div>
      </div>
    );
  }
  const [clients, client, products, negotiationType, financialOrder] =
    await Promise.all([
      findAllClient(),
      findOneClient({ id: proposal.client_id }),
      findAllProduct(),
      findAllNegotiationType(),
      findOneFinancialOrder({ proposal_id: proposal.id }),
    ]);
  if (!client) {
    return (
      <div>
        <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <div>
            <h1 className="text-base font-semibold leading-7 text-gray-900">
              Cliente não encontrado
            </h1>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
        <div>
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Atualização de proposta
          </h1>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Preencha o formulário abaixo para atualizar uma proposta.
          </p>
        </div>
      </div>
      <div className="gap-6 px-4 sm:px-6 lg:px-8">
        <ClientProposalUpdateForm
          clients={clients}
          client={client}
          products={products}
          proposal={proposal}
          negotiationType={negotiationType}
        />
        <FinancialOrderCreateForm />
      </div>
    </div>
  );
}
