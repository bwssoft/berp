import {
  findManyClient,
  findOneClient,
} from "@/backend/action/commercial/client.action";
import { findAllNegotiationType } from "@/backend/action/commercial/negotiation-type.action";
import { findOneProposal } from "@/backend/action/commercial/proposal.action";
import { findManyConfigurationProfile } from "@/backend/action/engineer/configuration-profile.action";
import { findManyProduct } from "@/backend/action/commercial/product/product.action";
import { findOneFinancialOrder } from "@/backend/action/financial/financial-order.action";
import { findManyProductionOrder } from "@/backend/action/production/production-order.action";
import { ProposalUpdateForm } from '@/frontend/ui/form/commercial/proposal/update/client-proposal.update.form';
import { FinancialOrderFromProposalCreateForm } from '@/frontend/ui/form/financial/create-from-proposal/financial-order-from-proposal-create-form';

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
    { docs: products },
    negotiationType,
    financialOrder,
    productionOrders,
    configurationProfiles,
  ] = await Promise.all([
    findManyClient({}),
    findOneClient({ id: proposal.client_id }),
    findManyProduct({ filter: {} }),
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
          client_document_value={client.document.value}
        />
      </div>
    </div>
  );
}

