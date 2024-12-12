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
      { id: proposal_id },
      {
        $unset: {
          [`signature_process.${scenario_id}`]: ""
        }
      })
    try {
    } catch (err) {
      throw err;
    }
  }

}

export const cancelSignatureProcessUscase = singleton(
  CancelSignatureProcessUscase
);