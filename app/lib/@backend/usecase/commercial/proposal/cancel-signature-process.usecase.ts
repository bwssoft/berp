import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository, IProposalRepository } from "../../../domain";
import { proposalObjectRepository, proposalRepository } from "@/app/lib/@backend/infra";

class CancelSignatureProcessUscase {
  proposalDocumentRepository: IProposalRepository;
  proposalObjectRepository: IProposalObjectRepository;

  constructor() {
    this.proposalDocumentRepository = proposalRepository
    this.proposalObjectRepository = proposalObjectRepository;
  }

  async execute(input: {
    scenario_id: string,
    proposal_id: string,
  }) {
    const { scenario_id, proposal_id } = input


    const proposal = await this.proposalDocumentRepository.findOne({ id: proposal_id })
    if (!proposal) {
      throw new Error("No proposal found")
    }

    const scenario = proposal.scenarios.find(sce => sce.id === scenario_id)
    if (!scenario) {
      throw new Error("No scenario found")
    }

    const signature_process = scenario.signature_process
    if (!signature_process) {
      throw new Error("No signature_process found")
    }

    const documents = signature_process.documents

    await Promise.all(documents.map(doc => this.proposalObjectRepository.deleteOne(doc.key)))

    await this.proposalDocumentRepository.updateOne(
      {
        id: proposal_id,
        "scenarios.id": scenario_id
      },
      {
        $unset: {
          ["scenarios.$.signature_process"]: ""
        }
      }
    )
    try {
    } catch (err) {
      throw err;
    }
  }

}

export const cancelSignatureProcessUscase = singleton(
  CancelSignatureProcessUscase
);