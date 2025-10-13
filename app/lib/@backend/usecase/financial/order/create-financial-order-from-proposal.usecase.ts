import { singleton } from "@/app/lib/util/singleton";
import type { IProposalRepository } from "@/backend/domain/commercial";
import type { IFinancialOrder } from "@/backend/domain/financial/entity/financial-order.definition";
import type { IFinancialOrderRepository } from "@/backend/domain/financial/repository/order.repository";
import { financialOrderRepository, proposalRepository } from "@/backend/infra";
import {
  analyseProposalScenarioUsecase,
  type IAnalyseProposalScenarioUsecase,
} from "@/backend/usecase/commercial/proposal/analyse-proposal-scenario.usecase";
import { createOneFinancialOrderUsecase } from "@/backend/usecase/financial/order/create-one-financial-order.usecase";

class CreateFinancialOrderFromProposalUsecase {
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase;
  proposalRepository: IProposalRepository;
  financialOrderRepository: IFinancialOrderRepository;

  constructor() {
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase;
    this.proposalRepository = proposalRepository;
    this.financialOrderRepository = financialOrderRepository;
  }

  async execute(input: { proposal_id: string; scenario_id: string }) {
    const { scenario_id, proposal_id } = input;

    const proposal = await this.proposalRepository.findOne({ id: proposal_id });
    if (!proposal) {
      throw new Error("No proposal found");
    }

    const scenario = proposal.scenarios.find((item) => item.id === scenario_id);
    if (!scenario) {
      throw new Error("No scenario found");
    }

    const analysis = await this.analyseProposalScenarioUsecase.execute({
      scenario,
    });

    const lineItemsProcessed = analysis
      .filter((item) => item.requires_financial_order)
      .map(({ enterprise_id, line_item_id }) => {
        const proposalLineItem = scenario.line_items.find(
          (lineItem) => lineItem.id === line_item_id
        );

        if (!proposalLineItem) {
          return undefined;
        }

        return {
          enterprise_id,
          negotiation_type_id: proposalLineItem.negotiation_type_id,
          items: [{ ...proposalLineItem }],
        };
      })
      .reduce((acc, cur) => {
        if (!cur) {
          return acc;
        }

        if (!acc[cur.enterprise_id]) {
          acc[cur.enterprise_id] = {
            enterprise_id: cur.enterprise_id,
            negotiation_type_id: cur.negotiation_type_id,
            items: [],
            installment_quantity: null,
            installment: null,
            entry_amount: null,
          };
        }

        acc[cur.enterprise_id].items.push(...cur.items);
        return acc;
      }, {} as Record<string, IFinancialOrder["line_items_processed"][number]>);

    await createOneFinancialOrderUsecase.execute({
      line_items: scenario.line_items,
      client_id: proposal.client_id,
      proposal_id: proposal.id,
      line_items_processed: Object.values(lineItemsProcessed),
      active: true,
      products: [] as IFinancialOrder["products"],
      omie_webhook_metadata: null as unknown as IFinancialOrder["omie_webhook_metadata"],
    });
  }
}

export const createFinancialOrderFromProposalUsecase = singleton(
  CreateFinancialOrderFromProposalUsecase
);
