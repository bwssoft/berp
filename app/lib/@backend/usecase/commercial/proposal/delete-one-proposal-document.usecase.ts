import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository } from "../../../domain/commercial/repository/proposal.object.repository";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "@/app/lib/@backend/infra";
import { proposalObjectRepository } from "@/app/lib/@backend/infra";

class DeleteOneProposalDocumentUsecase {
  objectRepository: IProposalObjectRepository;
  documentRepository: IProposalRepository;

  constructor() {
    this.objectRepository = proposalObjectRepository;
    this.documentRepository = proposalRepository;
  }

  async execute(input: {
    proposal_id: string,
    scenario_id: string,
    document: NonNullable<IProposal["scenarios"][number]["document"]>[number]
  }) {
    try {
      const {
        proposal_id,
        scenario_id,
        document
      } = input

      await this.objectRepository.deleteOne(document.key)

      await this.documentRepository.updateOne(
        {
          id: proposal_id,
          "scenarios.id": scenario_id
        },
        { $pullAll: { ["scenarios.$.document"]: [document] } }
      )
    } catch (err) {
      throw err
    }
  }
}

export const deleteOneProposalDocumentUsecase = singleton(
  DeleteOneProposalDocumentUsecase
);