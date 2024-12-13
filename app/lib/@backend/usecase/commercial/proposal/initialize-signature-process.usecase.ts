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
    try {
      const proposal = await this.proposalRepository.findOne({ id: proposal_id })
      if (!proposal) {
        throw new Error("No proposal found")
      }

      const scenario = proposal.scenarios.find(sce => sce.id === scenario_id)
      if (!scenario) {
        throw new Error("No scenario found")
      }

      const document = scenario?.document
      if (!document) {
        throw new Error("No document found")
      }
      const signature_process: NonNullable<IProposal["scenarios"][number]["signature_process"]> = {
        contact: [],
        document_id: document.map(({ id }) => id),
        id: crypto.randomUUID()
      }
      await this.proposalRepository.updateOne(
        {
          id: proposal_id,
          "scenarios.id": scenario_id
        },
        {
          $set: {
            ["scenarios.$.signature_process"]: signature_process
          }
        }
      )
    } catch (err) {
      throw err;
    }
  }

}

export const initializeSignatureProcessUscase = singleton(
  InitializeSignatureProcessUscase
);