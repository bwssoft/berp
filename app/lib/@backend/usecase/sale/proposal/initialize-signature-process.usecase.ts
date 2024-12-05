import { singleton } from "@/app/lib/util/singleton";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "@/app/lib/@backend/infra";
import { analyseProposalScenarioUsecase, IAnalyseProposalScenarioUsecase } from "./analyse-proposal-scenario.usecase";

class InitializeSignatureProcessUscase {
  analyseProposalScenarioUsecase: IAnalyseProposalScenarioUsecase
  proposalRepository: IProposalRepository;

  constructor() {
    this.analyseProposalScenarioUsecase = analyseProposalScenarioUsecase
    this.proposalRepository = proposalRepository
  }

  async execute(input: {
    proposal_id: string,
    scenario_id: string,
    document_id: string[]
  }) {
    const { document_id, proposal_id, scenario_id } = input
    const signature_process: NonNullable<IProposal["signature_process"]>[number] = {
      contact: [],
      document_id: document_id.map(id => id),
      id: crypto.randomUUID()
    }
    await this.proposalRepository.updateOne(
      { id: proposal_id },
      {
        $set: {
          [`signature_process.${scenario_id}`]: signature_process
        }
      })
    try {
    } catch (err) {
      throw err;
    }
  }

}

export const initializeSignatureProcessUscase = singleton(
  InitializeSignatureProcessUscase
);