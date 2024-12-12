import { singleton } from "@/app/lib/util/singleton";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "@/app/lib/@backend/infra";
import { analyseProposalScenarioUsecase, IAnalyseProposalScenarioUsecase } from "./analyse-proposal-scenario.usecase";
import { OmieEnterpriseEnum } from "../../../domain/@shared/gateway/omie.gateway.interface";

class InitializeBillingProcessUscase {
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase
  proposalRepository: IProposalRepository;

  constructor() {
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase
    this.proposalRepository = proposalRepository
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

      const billing_process = Object.entries(analysis
        .filter(el => !!el.requires_sale_order)
        .reduce((acc, cur) => ({
          ...acc,
          [cur.omie_enterprise]: {
            id: crypto.randomUUID(),
            line_item_id: [...(acc[cur.omie_enterprise]?.line_item_id || []), cur.line_item_id]
          }
        }), {} as { [key in OmieEnterpriseEnum]: { id: string, line_item_id: string[] } }))
        .map(([key, value]) => ({ ...value, omie_enterprise: key }))

      await this.proposalRepository.updateOne(
        { id: proposal_id },
        {
          $set: {
            [`billing_process.${scenario.id}`]: billing_process
          }
        })
    } catch (err) {
      throw err;
    }
  }

}

export const initializeBillingProcessUscase = singleton(
  InitializeBillingProcessUscase
);