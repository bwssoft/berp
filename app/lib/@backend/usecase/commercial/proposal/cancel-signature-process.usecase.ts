import { singleton } from "@/app/lib/util/singleton";
import { IProposalRepository } from "../../../domain";
import { proposalRepository } from "@/app/lib/@backend/infra";

class CancelSignatureProcessUscase {
  proposalRepository: IProposalRepository;

  constructor() {
    this.proposalRepository = proposalRepository
  }

  async execute(input: {
    scenario_id: string,
    proposal_id: string,
  }) {
    const { scenario_id, proposal_id } = input
    await this.proposalRepository.updateOne(
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