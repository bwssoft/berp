import { singleton } from "@/app/lib/util/singleton";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "../../../repository/mongodb";
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
    contact_id: string[]
  }) {
    const { document_id, contact_id, proposal_id, scenario_id } = input
    const signature_process: NonNullable<IProposal["signature_process"]>[number] = {
      contact: contact_id.map(id => ({
        id,
        seen: false,
        sent: false,
        signed: false,
        requested: false
      })),
      document_id: document_id.map(id => id),
      scenario_id: scenario_id,
      id: crypto.randomUUID()
    }
    await this.proposalRepository.updateOne(
      { id: proposal_id },
      {
        $push: {
          signature_process
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