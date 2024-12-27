import { singleton } from "@/app/lib/util/singleton";
import { IFinancialOrder, IFinancialOrderRepository, IProposalRepository } from "@/app/lib/@backend/domain";
import { financialOrderRepository, proposalRepository } from "@/app/lib/@backend/infra";
import { analyseProposalScenarioUsecase, IAnalyseProposalScenarioUsecase } from "../../commercial/proposal/analyse-proposal-scenario.usecase";
import { createOneFinancialOrderUsecase } from "./create-one-financial-order.usecase";

class CreateFinancialOrderFromProposalUsecase {
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase
  proposalRepository: IProposalRepository;
  financialOrderRepository: IFinancialOrderRepository;

  constructor() {
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase
    this.proposalRepository = proposalRepository
    this.financialOrderRepository = financialOrderRepository
  }

  async execute(input: { proposal_id: string, scenario_id: string }) {
    const { scenario_id, proposal_id } = input
    try {
      const proposal = await this.proposalRepository.findOne({ id: proposal_id })
      if (!proposal) {
        throw new Error("No proposal found")
      }

      const scenario = proposal.scenarios.find(sce => sce.id === scenario_id)
      if (!scenario) {
        throw new Error("No scenario found")
      }

      const analysis = await this.analyseProposalScenarioUsecase.execute({ scenario })

      const line_items_processed = analysis
        .filter(el => el.requires_sale_order)
        .map(({ enterprise_id, line_item_id }) => {
          const proposal_line_item = scenario.line_items.find(l => l.id === line_item_id)
          if (!proposal_line_item) return undefined
          return {
            enterprise_id,
            items: [{
              ...proposal_line_item
            }]
          }
        })
        .reduce((acc, cur) => {
          if (!cur) return acc
          if (!acc[cur.enterprise_id]) {
            acc[cur.enterprise_id] = {
              enterprise_id: cur.enterprise_id,
              items: [],
              installment_quantity: null,
              installment: null,
            };
          }

          acc[cur.enterprise_id].items.push(...cur.items);
          return acc;
        }, {} as { [key: string]: IFinancialOrder["line_items_processed"][number] })

      await createOneFinancialOrderUsecase.execute({
        line_items: scenario.line_items,
        client_id: proposal.client_id,
        proposal_id: proposal.id,
        line_items_processed: Object.values(line_items_processed),
        active: true,
        products: null as any,
        omie_webhook_metadata: null as any
      })
    } catch (err) {
      throw err;
    }
  }

}

export const createFinancialOrderFromProposalUsecase = singleton(
  CreateFinancialOrderFromProposalUsecase
);