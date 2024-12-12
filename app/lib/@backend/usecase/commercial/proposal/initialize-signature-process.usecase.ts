import { singleton } from "@/app/lib/util/singleton";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "@/app/lib/@backend/infra";

class InitializeSignatureProcessUscase {
  proposalRepository: IProposalRepository;

  constructor() {
    this.proposalRepository = proposalRepository
  }

  async execute(input: { proposal_id: string, scenario_id: string }) {
    const { proposal_id, scenario_id } = input
    const proposal = await this.proposalRepository.findOne({ id: proposal_id })
    if (!proposal) {
      throw new Error("No proposal found")
    }

    const scenario = proposal.scenarios.find(sce => sce.id === scenario_id)
    if (!scenario) {
      throw new Error("No scenario found")
    }

    const document = scenario?.documents
    if (!document) {
      throw new Error("No document found")
    }
    const signature_process: NonNullable<IProposal["scenarios"][number]["signature_process"]> = {
      contact: [],
      document_id: document.map(({ id }) => id),
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