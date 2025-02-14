import {
  findManyClient,
  findAllNegotiationType,
  findManyProduct,
  findManyProductionOrder,
  findOneClient,
  findOneFinancialOrder,
  findManyConfigurationProfile,
} from "@/app/lib/@backend/action";
import { findOneProposal } from "@/app/lib/@backend/action";
import {
  ProposalUpdateForm,
  FinancialOrderFromProposalCreateForm,
} from "@/app/lib/@frontend/ui/form";
import { ProductionOrderFromProposalCreateForm } from "@/app/lib/@frontend/ui/form/production/production-order/create-from-proposal";

interface Props {
  searchParams: { id: string };
}

export default async function Page(props: Props) {
  const {
    searchParams: { id },
  } = props;
  const proposal = await findOneProposal({ id });
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
  const [
    clients,
    client,
    products,
    negotiationType,
    financialOrder,
    productionOrders,
    configurationProfiles,
  ] = await Promise.all([
    findManyClient({}),
    findOneClient({ id: proposal.client_id }),
    findManyProduct(),
    findAllNegotiationType(),
    findOneFinancialOrder({ proposal_id: proposal.id }),
    findManyProductionOrder({ "proposal.id": proposal.id }),
    findManyConfigurationProfile({ client_id: proposal.client_id }),
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
        <ProposalUpdateForm
          clients={clients}
          client={client}
          products={products}
          proposal={proposal}
          negotiationType={negotiationType}
        />
        <FinancialOrderFromProposalCreateForm
          financial_order={financialOrder}
          proposal_id={proposal.id}
          scenario_id={proposal.scenarios[0].id}
        />
        <ProductionOrderFromProposalCreateForm
          configuration_profiles={configurationProfiles}
          production_orders={productionOrders}
          proposal_id={proposal.id}
          scenario_id={proposal.scenarios[0].id}
          client_id={client.id}
        />
      </div>
    </div>
  );
}
