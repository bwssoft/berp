import { singleton } from "@/app/lib/util/singleton";
import { IProposalObjectRepository } from "../../../domain/client/repository/proposal.object.repository";
import { proposalObjectRepository } from "../../../repository/s3/proposal.repository";
import { IProposal, IProposalRepository } from "../../../domain";
import { proposalRepository } from "../../../repository/mongodb";

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
    document: NonNullable<IProposal["document"]>[string][number]
  }) {
    try {
      const {
        proposal_id,
        scenario_id,
        document
      } = input

      await this.objectRepository.deleteOne(document.key)

      await this.documentRepository.updateOne(
        { id: proposal_id },
        { $pullAll: { [`document.${scenario_id}`]: [document] } }
      )
    } catch (err) {
      throw err
    }
  }
}

export const deleteOneProposalDocumentUsecase = singleton(
  DeleteOneProposalDocumentUsecase
);