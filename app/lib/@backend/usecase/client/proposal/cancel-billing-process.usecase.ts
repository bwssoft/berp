import { singleton } from "@/app/lib/util/singleton";
import { IProposalRepository } from "../../../domain";
import { proposalRepository } from "../../../repository/mongodb";
import { analyseProposalScenarioUsecase, IAnalyseProposalScenarioUsecase } from "./analyse-proposal-scenario.usecase";

class CancelBillingProcessUscase {
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase
  proposalRepository: IProposalRepository;

  constructor() {
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase
    this.proposalRepository = proposalRepository
  }

  async execute(input: {
    scenario_id: string,
    proposal_id: string,
  }) {
    const { scenario_id, proposal_id } = input
    await this.proposalRepository.updateOne(
      { id: proposal_id },
      {
        $unset: {
          [`billing_process.${scenario_id}`]: ""
        }
      })
    try {
    } catch (err) {
      throw err;
    }
  }

}

export const cancelBillingProcessUscase = singleton(
  CancelBillingProcessUscase
);