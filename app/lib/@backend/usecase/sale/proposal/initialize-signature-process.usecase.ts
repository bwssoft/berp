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
    const document = proposal.document?.[scenario_id]
    if (!document) {
      throw new Error("No document found")
    }
    const signature_process: NonNullable<IProposal["signature_process"]>[number] = {
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